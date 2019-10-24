<template>
    <b-container>
        <h2>Viewing CD #{{ id }}</h2>
    </b-container>
</template>

<script>
export default {
    props: {
        id: [Number,String]
    },
    mounted () {
        console.log(this.$route);
    }
}
</script>