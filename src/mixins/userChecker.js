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
        },

        hasRole: (roles) => {
            if (!Array.isArray(roles))
                roles = [roles]

            console.log('checking roles ', store.getters.roles)
            console.log('criteria : ', roles)

            // just simply check em
            var result = store.getters.roles.filter(e => roles.indexOf(e) !== -1)
            console.log('result: ', result)

            return result.length > 0
        }
    }
}