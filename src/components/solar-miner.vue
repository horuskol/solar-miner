<template>
    <div class="w-1/3 m-auto">
        <div class="border grid grid-cols-card-2 p-1">
            <h1 class="col-start-left col-end-right">Earth</h1>

            <div class="col-start-left col-end-center">Money</div>
            <div class="col-start-center col-end-right text-right">{{ earth.money }}</div>

            <div class="col-start-left col-end-center">Unprocessed resources</div>
            <div class="col-start-center col-end-right text-right">{{ earth.unprocessedResources }}</div>

            <div class="col-start-left col-end-center">Processing capacity</div>
            <div class="col-start-center col-end-right text-right">{{ earth.processingCapacity }}</div>

            <div class="col-start-left col-end-center">Storage capacity</div>
            <div class="col-start-center col-end-right text-right">{{ earth.storageCapacity }}</div>

            <div class="col-start-left col-end-right">
                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyStorage(earth)">Buy storage (100)</button>

                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyProcessor(earth)">Buy processor (100)</button>
            </div>
        </div>

        <div class="border grid grid-cols-card-2 p-1" v-for="(planet, index) in planets" :key="index">
            <h1 class="col-start-left col-end-right">{{ planet.name }}</h1>

            <div class="col-start-left col-end-center">Stored resources</div>
            <div class="col-start-center col-end-right text-right">{{ planet.storedResources }}</div>

            <div class="col-start-left col-end-center">Unmined</div>
            <div class="col-start-center col-end-right text-right">{{ planet.unminedResources }}</div>

            <div class="col-start-left col-end-center">Mining capacity</div>
            <div class="col-start-center col-end-right text-right">{{ planet.miningCapacity }}</div>

            <div class="col-start-left col-end-center">Storage capacity</div>
            <div class="col-start-center col-end-right text-right">{{ planet.storageCapacity }}</div>

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
                        @click="buyMiner(planet)">Buy miner (100)</button>

                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyStorage(planet)">Buy storage (100)</button>

                <button class="border hover:bg-green-500 m-1 p-1 "
                        @click="buyShip(planet)">Buy ship (100)</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        timer: null,

        earth: {
          unprocessedResources: 0,
          money: 1000,
          processingCapacity: 0,
          storageCapacity: 0,
        },

        planets: [
          {
            name: 'Moon',
            distance: 26,  // actually 0.00256 but scale... x10000
            unminedResources: 1000000000,
            miningCapacity: 0,
            storageCapacity: 0,
            storedResources: 0,
            ships: [],
          },
          {
            name: 'Mars',
            distance: 15000,
            unminedResources: 1000000000,
            miningCapacity: 0,
            storageCapacity: 0,
            storedResources: 0,
            ships: [],
          },
        ],
      }
    },

    methods: {
      buyMiner(planet) {
          planet.miningCapacity += 1;

          this.earth.money -= 100;
      },

      buyProcessor() {
        this.earth.processingCapacity += 1;

        this.earth.money -= 100;
      },

      buyShip(planet) {
          planet.ships.push({
            speed: 1,
            progress: 0,
            distance: planet.distance,
            capacity: 1000,
            load: 0,
            status: "loading",
          });

          this.earth.money -= 100;
      },

      buyStorage(planet) {
          planet.storageCapacity += 1000;

          this.earth.money -= 100;
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
        let amountProcessed = this.earth.processingCapacity;

        if (this.earth.unprocessedResources < amountProcessed) {
          amountProcessed = this.earth.unprocessedResources;
        }
        this.earth.money += amountProcessed;
        this.earth.unprocessedResources -= amountProcessed;
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
              ship.progress += ship.speed;

              if (ship.progress > ship.distance) {
                ship.status = 'unloading';
                ship.progress = 0;
              }
              break;

            case 'unloading':
              let unloading = ship.load;

              if (this.earth.storageCapacity - this.earth.unprocessedResources < unloading) {
                unloading = this.earth.storageCapacity - this.earth.unprocessedResources;
              }

              ship.load -= unloading;
              this.earth.unprocessedResources += unloading;

              if (ship.load === 0) {
                ship.status = 'toPlanet';
              }
              break;

            case 'toPlanet':
              ship.progress += ship.speed;

              if (ship.progress > ship.distance) {
                ship.status = 'loading';
                ship.progress = 0;
              }
              break;
          }
        });
      }
    },

    mounted() {
      if (!this.timer) {
        this.timer = setInterval(() => {
            this.planets.forEach((planet) => {
              this.mine(planet);
              this.ship(planet);
            })

            this.process();
        }, 10);
      }
    }
}
</script>

