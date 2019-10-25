<template>
    <div>
        <h2>Viewing CD #{{ id }}</h2>
    </div>
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