<template>
    <h4>
        <template v-if="!isNew">
            <span :class="[ data.is_locked ? 'bg-danger' : 'bg-primary', 'text-light', 'p-2', 'shadow', 'border', 'border-dark', 'rounded']">{{ doctype }} #{{ data.id }} <b-badge variant="light"><font-awesome-icon :icon="data.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon> {{ data.is_locked ? "LOCKED" : "OPEN" }}</b-badge></span>
        </template>
        <template v-else>
            Input {{ doctype }} Baru
        </template>
    </h4>
</template>

<script>
export default {
    props: {
        data: Object,
        isNew: [Boolean, String, Number],
        doctype: String
    }
}
</script>