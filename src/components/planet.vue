<template>
    <div class="relative border grid grid-cols-card-2 p-1 my-2 overflow-hidden text-gray-300">
        <img class="planet-bg" :src="background" alt="" role="presentation"></img>

        <h1 class="col-start-left col-end-center font-bold capitalize">{{ planet.name }}</h1>
        <div class="col-start-center col-end-right text-right">{{ planet.buildings }} / {{ planet.buildLimit }}</div>

        <div class="col-start-left col-end-center">Distance (average)</div>
        <div class="col-start-center col-end-right text-right">{{ new Intl.NumberFormat().format(planet.distance * 10000) }} km</div>

        <div class="col-start-left col-end-center">Unmined resources</div>
        <div class="col-start-center col-end-right text-right">{{ new Intl.NumberFormat().format(planet.unminedResources) }} Mm<sup>3</sup></div>

        <div class="col-start-left col-end-center">Mining capacity</div>
        <div class="col-start-center col-end-right text-right">{{ planet.miningCapacity }} Mm<sup>3</sup></div>

        <div class="col-start-left col-end-center">Storage</div>
        <div class="col-start-center col-end-right text-right">{{ planet.storedResources }} / {{ planet.storageCapacity }} Mm<sup>3</sup></div>

        <div class="col-start-left col-end-center">Ships</div>
        <div class="col-start-center col-end-right text-right">
            {{ planet.ships.filter((ship) => { return ship.status === 'loading'}).length }} /
            {{ planet.ships.filter((ship) => { return ship.status === 'toEarth'}).length }} /
            {{ planet.ships.filter((ship) => { return ship.status === 'unloading'}).length }} /
            {{ planet.ships.filter((ship) => { return ship.status === 'toPlanet'}).length }} /
            {{ planet.ships.length }}
        </div>

        <div class="col-start-left col-end-right">
            <button class="border border-gray-800 bg-black hover:bg-green-500 m-1 p-1 "
                    @click="$emit('buy-miner')">Buy miner ($100,000)</button>

            <button class="border border-gray-800 bg-black hover:bg-green-500 m-1 p-1 "
                    @click="$emit('buy-storage')">Buy storage ($100,000)</button>

            <button class="border border-gray-800 bg-black hover:bg-green-500 m-1 p-1 "
                    @click="$emit('buy-ship')">Buy ship ($100,000)</button>

            <button class="border border-gray-800 bg-black hover:bg-green-500 m-1 p-1 "
                    @click="$emit('upgrade-ships')">Upgrade ships ($100,000)</button>

            <button class="border border-gray-800 bg-black hover:bg-red-500 m-1 p-1 "
                    @click="$emit('abandon')">Abandon</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
      planet: {
        type: Object,
        required: true,
      }
    },

    computed: {
      background() {
        return `/img/${this.planet.name}-500.jpg`;
      }
    }
}
</script>