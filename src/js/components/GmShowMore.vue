<template>
    <div class="showmore" :class="{'showmore--expanded': isExpanded, 'showmore--collapsed': !isExpanded}">
        <div class="showmore__content">
            <slot></slot>
        </div>
        <div class="showmore__buttons">
            <button @click="showMore(true)" v-if="!isExpanded" class="btn btn-sm btn-light">{{ labelShowMore }}</button>
            <button @click="showMore(false)" v-if="isExpanded" class="btn btn-sm btn-light">{{ labelShowLess }}</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isExpanded: this.expand
        }
    },
    props: {
        expand: {
            type: Boolean,
            default: false
        },
        labelShowMore: {
            type: String,
            default: 'Show more'
        },
        labelShowLess: {
            type: String,
            default: 'Show less'
        }
    },
    methods: {
        showMore(status) {
            this.isExpanded = status
        }
    }
}
</script>

<style scoped lang="scss">
.showmore {
  .showmore__content {
    margin-bottom: 20px;
  }

  &.showmore--collapsed {
    .showmore__content {
      max-height: 250px;
      overflow-y: hidden;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        z-index: 2;
        background: -webkit-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 95%);
        background: -moz-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 95%);
        background: -o-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 95%);
        background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 95%);
      }
    }

    .showmore__buttons {
    }
  }
}
</style>