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

            <div class="moreinfo" v-if="place.references.length">
                <h2>Meer weten</h2>
                <ul>
                    <li v-for="(reference,index) in place.references" :key="index">
                        <span v-if="!reference.url">{{ reference.label }}</span>
                        <a target="_blank" v-if="reference.url" :href="reference.url">{{ reference.label }}</a>
                    </li>
                </ul>
            </div>

            <div class="moreinfo" v-if="place.biblio.length">
                <h2>Bibliografie</h2>
                <ul>
                    <li v-for="(reference,index) in place.biblio" :key="index">
                        <span v-if="!reference.url">{{ reference.label }}</span>
                        <a v-if="reference.url" href="reference.url">{{ reference.label }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import PlaceService from "../services/PlaceService";

import GmIiifCollectionGallery from "./GmIiifCollectionGallery";
import GmShowMore from "./GmShowMore";

export default {
    name: "GmPlaceInfo",
    components: {
        GmIiifCollectionGallery,
        GmShowMore
    },
    data() {
        return {
            place: null
        }
    },
    computed: {
        placeId() {
            if (this.$store.state.map.selectFeature) {
                return this.$store.state.map.selectFeature.properties.id;
            } else {
                return null
            }
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

            // console.log([this.place?.startDate, this.place?.endDate, result])

            return result?.startYear ? result.startYear + ( result?.endYear ? ' – ' + result.endYear : ' – heden' ) : null
        }
    },
    methods: {
        async loadPlaceData(id) {
            const place = await PlaceService.get(id)
            this.place = place;
        },
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
    watch: {
        async placeId(newId, oldId) {
            await this.loadPlaceData(newId)
            this.$store.dispatch('sidebarInfo/collapse', false)
        }
    }
}
</script>