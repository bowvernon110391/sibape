// this mixin provides user checking capabilities
import store from '../store'

export default {
    computed: {
        canEdit: () => {
            return store.getters.canEdit
        }
    },
    methods: {
        canDelete: (isDocLocked) => {
            return store.getters.canEdit || !isDocLocked
        }
    }
}