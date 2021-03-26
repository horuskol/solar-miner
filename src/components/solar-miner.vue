<template>
    <div class="w-1/3 m-auto">
        <div class="relative border grid grid-cols-card-2 p-1 my-2 overflow-hidden text-gray-300">
            <img class="planet-bg" src="/img/earth-500.jpg" alt="" role="presentation"></img>

            <h1 class="col-start-left col-end-center font-bold">Earth</h1>
            <div class="col-start-center col-end-right text-right">{{ earth.buildings }} / {{ earth.buildLimit }}</div>

            <div class="col-start-left col-end-center">Money</div>
            <div class="col-start-center col-end-right text-right">${{ new Intl.NumberFormat().format(earth.money) }},000</div>

            <div class="col-start-left col-end-center">Processing capacity</div>
            <div class="col-start-center col-end-right text-right">{{ earth.processingCapacity }} Mm<sup>3</sup></div>

            <div class="col-start-left col-end-center">Storage</div>
            <div class="col-start-center col-end-right text-right">{{ earth.unprocessedResources }} / {{ earth.storageCapacity }} Mm<sup>3</sup></div>

            <div class="col-start-left col-end-right">
                <button class="border border-gray-800 bg-black hover:bg-green-500 m-1 p-1 "
                        @click="buyProcessor(earth)">Buy processor ($100,000)</button>

                <button class="border border-gray-800 bg-black hover:bg-green-500 m-1 p-1 "
                        @click="buyStorage(earth)">Buy storage ($100,000)</button>
            </div>
        </div>

        <planet v-for="(planet, index) in planets"
                :key="index"
                class="border grid grid-cols-card-2 p-1 my-2"
                :planet="planet"
                @buy-miner="buyMiner(planet)"
                @buy-storage="buyStorage(planet)"
                @buy-ship="buyShip(planet)"
                @upgrade-ships="upgradeShips(planet)"
                @abandon="abandon(planet)"
        >

        </planet>
    </div>
</template>

<script>
import Planet from './planet';

// TODO
// 1. cost to unlock planets beyond moon
// 2. increase price of new buildings
// 3. increase maintenance on further planets?
// 4. technology? space elevator? advantage?
// 5. varied resources? differential pricing? technology to unlock?
// 6. asteroids?
// 7. power?
// 8. announcements: "millionaire!"
// 9. GRAPHICS!
// 10. Ship load speed?
// 11. Ship speed cap?
// 12. Charts
// 13. Ship speed upgrades apply to new ships, too?
export default {
    components: {
        planet: Planet,
    },

    data() {
      return {
        timer: null,

        earth: {
          unprocessedResources: 0,
          money: 1000,
          processingCapacity: 0,
          storageCapacity: 0,
          buildLimit: 510, // 510,000,000 km2
          buildings: 0,
        },

        planets: [
          {
            name: 'moon',
            distance: 26,  // actually 0.00256 but scale... x10000
            buildLimit: 38, // 38,000,000 km2
            buildings: 0,
            unminedResources: 219000, // volume of moon is 21,900,000,000 km3
            miningCapacity: 0,
            storageCapacity: 0,
            storedResources: 0,
            ships: [],
          },
          {
            name: 'venus',
            distance: 2700, // 0.27 AU
            buildLimit: 460, // 460,000,000 km2
            buildings: 0,
            unminedResources: 9280000, // volume of venus is 928,000,000,000 km3
            miningCapacity: 0,
            storageCapacity: 0,
            storedResources: 0,
            ships: [],
          },
          {
            name: 'mars',
            distance: 15000, // 1.5 AU
            buildLimit: 145, // 145,000,000 km2
            buildings: 0,
            unminedResources: 1630000, // volume of mars is 163,000,000,000 km3
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
        if (planet.buildLimit > planet.buildings) {
          planet.miningCapacity += 1;

          this.earth.money -= 100;

          planet.buildings += 1;
        }
      },

      buyProcessor() {
        if (this.earth.buildLimit > this.earth.buildings) {
          this.earth.processingCapacity += 1;

          this.earth.money -= 100;

          this.earth.buildings += 1;
        }
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
        if (planet.buildLimit > planet.buildings) {
          planet.storageCapacity += 1000;

          this.earth.money -= 100;

          planet.buildings += 1;
        }
      },

      upgradeShips(planet) {
        planet.ships.forEach((ship) => {
          ship.speed += 1;
        });

        this.earth.money -= 100;
      },

      abandon(planet) {
        planet.buildings = 0;
        planet.ships = [];
        planet.storageCapacity = 1000;
        planet.storedResources = 0;
        planet.miningCapacity = 0;
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
        this.earth.money += amountProcessed * 5;
        this.earth.unprocessedResources -= amountProcessed;
      },

      maintenance() {
        this.earth.money -= this.earth.buildings;

        this.planets.forEach((planet) => {
            this.earth.money -= planet.buildings;
            this.earth.money -= planet.ships.length;
        });
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

            this.maintenance();
        }, 10);
      }
    }
}
</script>

<style>
    .planet-bg {
      position: absolute;
      z-index: -1;
      opacity: 0.5;
      width: 100%;
    }
</style>
