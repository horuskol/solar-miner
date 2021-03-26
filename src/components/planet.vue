<template>
    <div class="border grid grid-cols-card-2 p-1 my-2">
        <h1 class="col-start-left col-end-center font-bold">{{ planet.name }}</h1>
        <div class="col-start-center col-end-right text-right">{{ planet.buildings }} / {{ planet.buildLimit }}</div>

        <div class="col-start-left col-end-center">Unmined resources</div>
        <div class="col-start-center col-end-right text-right">{{ planet.unminedResources }}</div>

        <div class="col-start-left col-end-center">Mining capacity</div>
        <div class="col-start-center col-end-right text-right">{{ planet.miningCapacity }}</div>

        <div class="col-start-left col-end-center">Storage</div>
        <div class="col-start-center col-end-right text-right">{{ planet.storedResources }} / {{ planet.storageCapacity }}</div>

        <div class="col-start-left col-end-center">Ships</div>
        <div class="col-start-center col-end-right text-right">
            {{ planet.ships.filter((ship) => { return ship.status === 'loading'}).length }} /
            {{ planet.ships.filter((ship) => { return ship.status === 'toEarth'}).length }} /
            {{ planet.ships.filter((ship) => { return ship.status === 'unloading'}).length }} /
            {{ planet.ships.filter((ship) => { return ship.status === 'toPlanet'}).length }} /
            {{ planet.ships.length }}
        </div>

        <div class="col-start-left col-end-right">
            <button class="border hover:bg-green-500 m-1 p-1 "
                    @click="$emit('buy-miner')">Buy miner (100)</button>

            <button class="border hover:bg-green-500 m-1 p-1 "
                    @click="$emit('buy-storage')">Buy storage (100)</button>

            <button class="border hover:bg-green-500 m-1 p-1 "
                    @click="$emit('buy-ship')">Buy ship (100)</button>

            <button class="border hover:bg-green-500 m-1 p-1 "
                    @click="$emit('upgrade-ships')">Upgrade ships (100)</button>

            <button class="border hover:bg-red-500 m-1 p-1 "
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
    }
}
</script>