<template>
  <GmModal :isOpen="!!component" :title="title" @onClose="handleModalClose">
    <component :is="component" @onClose="handleClose" v-bind="props" />
  </GmModal>
</template>

<script>
import { ModalBus } from '../eventbus'

import GmModal from './GmModal'

export default {
  data () {
    return {
      component: null,
      title: '',
      props: null,
      closeOnClick: true
    }
  },
  created () {

    ModalBus.$on('open', ({ component, title = '', props = null, closeOnClick = true }) => {
      this.component = component
      this.title = title
      this.props = props
      this.closeOnClick = closeOnClick
    })

    document.addEventListener('keyup', this.handleKeyup)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleModalClose (force = false) {
      if (!this.closeOnClick && !force) return
      this.handleClose()
    },
    handleClose () {
      this.component = null
    },
    handleKeyup (e) {
      if (e.keyCode === 27) this.handleClose()
    }
  },
  components: { GmModal }
}
</script>