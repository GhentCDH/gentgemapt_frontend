<template>
    <div class="place-info" v-if="place">
        <div class="place-info__title">
            <h1>{{ place.title }}</h1>
            <div class="titles">
              <span v-if="place.titles.fr">
                  <span class="title__lang">fr</span>
                  <span v-for="(title,index) in place.titles.fr" :key="index" class="title__label">{{ title }}</span>
              </span>
                <span v-if="place.titles.ghents">
                  <span class="badge">gents</span>
                  <span v-for="(title,index) in place.titles.ghents" :key="index">{{ title }}</span>
              </span>
            </div>
        </div>
        <div class="place-info__content scrollable scrollable--vertical">
            <div class="features features--smaller mbottom-default">
                <span class="feature feature--date" v-if="dating">{{ dating }}</span>
                <span class="feature" v-for="feature in place.features">{{ feature }}</span>
            </div>

            <gm-show-more label-show-more="toon meer" label-show-less="toon minder">
                <div class="description" v-html="descriptionFormatted"></div>

                <div class="creators" v-if="place.creators.length">
                    Door
                    <ul>
                        <li v-for="(creator,index) in place.creators" :key="index">{{ creator }}</li>
                    </ul>
                </div>
            </gm-show-more>

            <h2 v-if="place.manifests.length && place.manifests[0].count">Collectie</h2>
            <gm-iiif-collection-gallery v-if="place.manifests && place.manifests.length" v-for="ref in place.manifests" :key="ref.url"
                                        :collectionUrl="ref.url"></gm-iiif-collection-gallery>

            <div class="more_info" v-if="place.references.length">
                <h2>Meer weten</h2>
                <ul>
                    <li v-for="(reference,index) in place.references" :key="index">
                        <span v-if="!reference.url">{{ reference.label }}</span>
                        <a target="_blank" v-if="reference.url" :href="reference.url">{{ reference.label }}</a>
                    </li>
                </ul>
            </div>

            <div class="referencing" v-if="citation">
                <h2>Hoe verwijs je naar dit artikel?</h2>
                <p>{{ citation }}</p>
                <p class="smaller">
                    Rechtenstatus: <a href="https://creativecommons.org/licenses/by-sa/2.0/be/deed.nl" target="_blank">CCBYSA</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import GmIiifCollectionGallery from "./GmIiifCollectionGallery";
import GmShowMore from "./GmShowMore";

import dateFormat from 'date-format'
import UrlHelper from "../helper/UrlHelper";

export default {
    name: "gm-place-info",
    components: {
        GmIiifCollectionGallery,
        GmShowMore
    },
    data() {
        return {
        }
    },
    props: {
        place: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        placeId() {
            return this.place?.id
        },
        descriptionFormatted() {
            return this.place.description
                .replaceAll('h2>', 'h3>')
                .replaceAll('h3>', 'h4>')
                .replaceAll('<p><strong>', '<h3>')
                .replaceAll('</strong></p>', '</h3>')
        },
        dating() {
            const result = {
                startYear: this.formatVagueYearObject(this.place?.startDate),
                endYear: this.formatVagueYearObject(this.place?.endDate),
            }
            return result?.startYear ? result.startYear + ( result?.endYear ? ' – ' + result.endYear : ' – heden' ) : null
        },
        permalink() {
            // todo: use url helper!
            return UrlHelper.getMapUrl() + UrlHelper.createPlaceUrl(this.placeId)
            // return process.env.URL_MAP + '/plaats/' + this.placeId
        },
        today() {
            const today = new Date()
            return today.getDate()  + "/" + (today.getMonth()+1) + "/" + today.getFullYear()
        },
        changed() {
            return this.place?.changed ? dateFormat.asString('dd/MM/yyyy', new Date(this.place.changed.date)) : null
        },
        citation() {
            let citationTemplate = this.$store.getters['project/getActiveProject']?.citationTemplate;
            if ( !citationTemplate )
                return null

            // replace placeholders
            const sr = new Map();
            sr.set('titel', this.place.title)
            sr.set('TITEL', this.place.title.toUpperCase())
            sr.set('auteur', this.place.creators.join(', '))
            sr.set('AUTEUR', this.place.creators.join(', ').toUpperCase())
            sr.set('permalink', this.permalink ?? '')
            sr.set('datum_vandaag', this.today ?? '')
            sr.set('datum_gewijzigd', this.changed ?? '')


            // search conditional parts
            const srConditional = new Map();
            const regex = /\|\?\(([a-zA-Z_-]+)\)([^|]*)\|([^|]*)\|/gm;
            let m;
            while ((m = regex.exec(citationTemplate)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                srConditional.set(m[0], sr.get(m[1]) ? m[2] : m[3])
            }

            srConditional.forEach((value, key) => {
                citationTemplate = citationTemplate.replace(key, value)
            })
            sr.forEach((value, key) => {
                citationTemplate = citationTemplate.replace('{{' + key + '}}', value)
            })

            return citationTemplate
        }
    },
    methods: {
        parseVagueYearExpression(year_expression) {
            const dateRangeRe = /P([0-9]{1,4})-([0-9]{1,4})([~?%]?)/i;
            const dateSingleRe = /([0-9]{1,4})([~?%]?)/i;
            let match;

            match = dateRangeRe.exec(year_expression)
            if ( match ) {
                return {
                    lbound: match[1],
                    ubound: match[2],
                    type: 'range',
                    modifier: match[3] === '' ? null : match[3]
                }
            }
            match = dateSingleRe.exec(year_expression)
            if ( match ) {
                return {
                    lbound: match[1],
                    ubound: match[1],
                    type: 'single',
                    modifier: match[2] === '' ? null : match[2]
                }
            }

            return null
        },
        formatVagueYearObject(year_expression) {
            if ( !year_expression )
                return null

            const year = this.parseVagueYearExpression(year_expression)
            if ( !year )
                return null

            let output = ''
            if ( year.type === 'single') {
                switch (year.modifier) {
                    case '~': output = `omstreeks ${year.lbound}`; break;
                    case '?': output = `${year.lbound} (onzeker)`; break;
                    case '%': output = `omstreeks ${year.lbound} (onzeker)`; break;
                    default: output = `${year.lbound}`; break;
                }

                return output
            }

            if (year.type === 'range') {
                const lrem = year.lbound % 100;
                const urem = year.ubound % 100;
                const lcen = Math.floor(year.lbound / 100 ) + 1
                const ucen = Math.floor(year.ubound / 100 ) + 1
                if ( lcen === ucen ) {
                    let prefix = null
                    let century = ( lcen === 1 || lcen === 8 || lcen >= 20 ) ? `${lcen}ste eeuw` : `${lcen}de eeuw`

                    if ( lrem === 0 && urem === 33 ) prefix = "begin";
                    if ( lrem === 33 && urem === 66 ) prefix = "midden";
                    if ( lrem === 66 && urem === 99 ) prefix = "eind";
                    if ( lrem === 0 && urem === 24 ) prefix = "1ste kwart";
                    if ( lrem === 25 && urem === 49 ) prefix = "2de kwart";
                    if ( lrem === 50 && urem === 74 ) prefix = "3de kwart";
                    if ( lrem === 75 && urem === 99 ) prefix = "4de kwart";
                    if ( lrem === 0 && urem === 49 ) prefix = "1ste helft";
                    if ( lrem === 50 && urem === 99 ) prefix = "2de helft";

                    if ( prefix )
                        output = `${prefix} ${century}`
                    else
                        output = `tussen ${year.lbound} en ${year.ubound}`
                } else {
                    output = `tussen ${year.lbound} en ${year.ubound}`
                }
                return output;
            }

        }
    },
}
</script>
