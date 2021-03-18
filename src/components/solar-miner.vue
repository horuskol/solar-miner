<template>
    <div class="w-1/3 m-auto">
        <div class="border grid grid-cols-card-2 p-1">
            <h1 class="col-start-left col-end-right">Earth</h1>

            <div class="col-start-left col-end-center">Money</div>
            <div class="col-start-center col-end-right text-right">{{ planets.earth.money }}</div>

            <div class="col-start-left col-end-center">Unprocessed resources</div>
            <div class="col-start-center col-end-right text-right">{{ planets.earth.unprocessedResources }}</div>

            <div class="col-start-left col-end-center">Processing capacity</div>
            <div class="col-start-center col-end-right text-right">{{ planets.earth.processingCapacity }}</div>

            <div class="col-start-left col-end-center">Storage capacity</div>
            <div class="col-start-center col-end-right text-right">{{ planets.earth.storageCapacity }}</div>

            <div class="col-start-left col-end-right">
                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyStorage(planets.earth)">Buy storage (100)</button>

                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyProcessor(planets.earth)">Buy processor (100)</button>
            </div>
        </div>

        <div class="border grid grid-cols-card-2 p-1">
            <h1 class="col-start-left col-end-right">Moon</h1>

            <div class="col-start-left col-end-center">Stored resources</div>
            <div class="col-start-center col-end-right text-right">{{ planets.moon.storedResources }}</div>

            <div class="col-start-left col-end-center">Unmined</div>
            <div class="col-start-center col-end-right text-right">{{ planets.moon.unminedResources }}</div>

            <div class="col-start-left col-end-center">Mining capacity</div>
            <div class="col-start-center col-end-right text-right">{{ planets.moon.miningCapacity }}</div>

            <div class="col-start-left col-end-center">Storage capacity</div>
            <div class="col-start-center col-end-right text-right">{{ planets.moon.storageCapacity }}</div>

            <div class="col-start-left col-end-center">Ships</div>
            <div class="col-start-center col-end-right text-right">{{ planets.moon.ships.length }}</div>

            <div class="col-start-left col-end-right">
                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyMiner(planets.moon)">Buy miner (100)</button>

                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyStorage(planets.moon)">Buy storage (100)</button>

                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyShip(planets.moon)">Buy ship (100)</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        timer: null,

        planets: {
          earth: {
            unprocessedResources: 0,
            money: 1000,
            processingCapacity: 0,
            storageCapacity: 0,
          },
          moon: {
            unminedResources: 1000000000,
            miningCapacity: 0,
            storageCapacity: 0,
            storedResources: 0,
            ships: [],
          }
        }
      }
    },

    methods: {
      buyMiner(planet) {
          planet.miningCapacity += 100;

          this.planets.earth.money -= 100;
      },

      buyProcessor() {
        this.planets.earth.processingCapacity += 100;

        this.planets.earth.money -= 100;
      },

      buyShip(planet) {
          planet.ships.push({
            capacity: 1000,
            load: 0,
            status: "loading",
          });

          this.planets.earth.money -= 100;
      },

      buyStorage(planet) {
          planet.storageCapacity += 1000;

          this.planets.earth.money -= 100;
      },

      mine(planet) {
        let amountMined = planet.miningCapacity;

        if (planet.unminedResources < amountMined) {
          amountMined = planet.unminedResources;
        }
        planet.storedResources += amountMined;

        if (planet.storedResources > planet.storageCapacity) {
          amountMined -= planet.storedResources - planet.storageCapacity;
          planet.storedResources = planet.storageCapacity;
        }

        planet.unminedResources -= amountMined;
      },

      process() {
        let amountProcessed = this.planets.earth.processingCapacity;

        if (this.planets.earth.unprocessedResources < amountProcessed) {
          amountProcessed = this.planets.earth.unprocessedResources;
        }
        this.planets.earth.money += amountProcessed;
        this.planets.earth.unprocessedResources -= amountProcessed;
      },

      ship(planet) {
        planet.ships.forEach((ship) => {
          switch (ship.status) {
            case 'loading':
              let loading = ship.capacity - ship.load;

              if (planet.storedResources < loading) {
                loading = planet.storedResources;
              }

              ship.load += loading;
              planet.storedResources -= loading;

              if (ship.load === ship.capacity) {
                ship.status = 'toEarth';
              }
              break;

            case 'toEarth':
              ship.status = 'unloading';
              break;

            case 'unloading':
              let unloading = ship.load;

              if (this.planets.earth.storageCapacity - this.planets.earth.unprocessedResources < unloading) {
                unloading = this.planets.earth.storageCapacity - this.planets.earth.unprocessedResources;
              }

              ship.load -= unloading;
              this.planets.earth.unprocessedResources += unloading;

              if (ship.load === 0) {
                ship.status = 'toPlanet';
              }
              break;

            case 'toPlanet':
              ship.status = 'loading';
              break;
          }
        });
      }
    },

    mounted() {
      if (!this.timer) {
        this.timer = setInterval(() => {
            this.mine(this.planets.moon);

            this.ship(this.planets.moon);

            this.process();
        }, 1000);
      }
    }
}
</script>

