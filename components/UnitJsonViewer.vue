<template>
  <v-card class="pa-2 my-6">
    <v-card-title class="justify-center">Explore JSON</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="search"
        label="Search Company Directory"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      />
      <v-treeview dense open-on-click :items="itemified">
        <template #append="{ item }">
          <p v-if="item.value !== undefined">{{ item.value }}</p>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'UnitJsonViewer',
  data() {
    return {
      search: null,
      items: [
        {
          ads: [
            {
              bidder: 'pubmatic',
              cpm: 0.68,
              currency: 'USD',
              hostname: 'www.accuweather.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-20T13:23:17.119Z',
              unitCode: '/6581/web/ch/top/news_info/country_home',
              won: true
            },
            {
              bidder: 'pubmatic',
              cpm: 0.61,
              currency: 'USD',
              hostname: 'www.accuweather.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-20T13:23:17.172Z',
              unitCode: '/6581/web/ch/top_right/news_info/country_home',
              won: true
            },
            {
              bidder: 'triplelift',
              cpm: 0.374,
              currency: 'USD',
              hostname: 'www.accuweather.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-20T13:23:17.256Z',
              unitCode: '/6581/web/ch/bottom/news_info/country_home',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 3.44,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-20T14:15:47.249Z',
              unitCode: '/8663477/CNNi/homepage_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 0.82,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-20T14:15:47.891Z',
              unitCode: '/8663477/CNNi/homepage_1',
              won: true
            },
            {
              bidder: 'pubmatic',
              cpm: 2.25,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-20T14:15:51.629Z',
              unitCode: '/8663477/CNNi/homepage_3',
              won: true
            },
            {
              bidder: 'pubmatic',
              cpm: 0.74,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-20T14:15:51.917Z',
              unitCode: '/8663477/CNNi/homepage_4',
              won: true
            },
            {
              bidder: 'criteo',
              cpm: 0.76,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-20T14:15:56.261Z',
              unitCode: '/8663477/CNNi/homepage_8',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 1.13,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-20T14:15:56.495Z',
              unitCode: '/8663477/CNNi/homepage_7',
              won: true
            },
            {
              bidder: 'onemobile',
              cpm: 2.398436,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-21T07:44:21.997Z',
              unitCode: 'mid-content_728x90',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 2.94,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:44:23.857Z',
              unitCode: '3379/conde.wired/hero/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'onemobile',
              cpm: 2.39,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:44:23.923Z',
              unitCode: '3379/conde.wired/mid-content/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'medianet',
              cpm: 4.25,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:44:24.641Z',
              unitCode: '3379/conde.wired/rail/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'medianet',
              cpm: 4.25,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:44:43.726Z',
              unitCode: '3379/conde.wired/rail/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 2.35,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:44:48.125Z',
              unitCode: '3379/conde.wired/hero/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 4.05,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-21T07:44:54.753Z',
              unitCode: 'ad_bnr_atf_01',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 4.05,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:44:55.359Z',
              unitCode: '/8663477/CNNi/homepage_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 0.79,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:44:55.661Z',
              unitCode: '/8663477/CNNi/homepage_1',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 3.972416,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-21T07:45:03.904Z',
              unitCode: 'ad_bnr_btf_02',
              won: true
            },
            {
              bidder: 'medianet',
              cpm: 4.251,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-21T07:45:04.998Z',
              unitCode: 'rail_300x250_300x600',
              won: true
            },
            {
              bidder: 'medianet',
              cpm: 4.25,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:45:05.071Z',
              unitCode: '3379/conde.wired/rail/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 0.67,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:45:05.440Z',
              unitCode: '/8663477/CNNi/homepage_4',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 2.35,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-21T07:45:06.363Z',
              unitCode: '3379/conde.wired/hero/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 4.06,
              currency: 'USD',
              hostname: 'www.accuweather.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T07:37:33.580Z',
              unitCode: '/6581/web/ch/top/news_info/country_home',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 0.594737,
              currency: 'USD',
              hostname: 'www.accuweather.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T07:37:34.176Z',
              unitCode: '/6581/web/ch/bottom/news_info/country_home',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 4,
              currency: 'USD',
              hostname: 'www.accuweather.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T07:37:34.274Z',
              unitCode: '/6581/web/bin_prebid/top/news_info/country_home_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 3,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T07:38:20.029Z',
              unitCode: '/8663477/CNNi/homepage_1',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 4.13,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T07:38:25.395Z',
              unitCode: '/8663477/CNNi/homepage_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 4.98,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T07:38:27.559Z',
              unitCode: '/8663477/CNNi/homepage_3',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 1.2,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T07:38:31.913Z',
              unitCode: '/8663477/CNNi/homepage_4',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 1.15,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T07:38:34.741Z',
              unitCode: 'ad_rect_btf_02',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 1.15,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T07:38:35.199Z',
              unitCode: '/8663477/CNNi/homepage_7',
              won: true
            },
            {
              bidder: 'ix',
              cpm: 0.88,
              currency: 'USD',
              hostname: 'edition.cnn.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T07:38:35.222Z',
              unitCode: '/8663477/CNNi/homepage_8',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 8.11,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T09:50:59.149Z',
              unitCode: 'rail_300x250_300x600',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 8,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T09:50:59.343Z',
              unitCode: '3379/conde.wired/rail/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 1.5,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T09:50:59.890Z',
              unitCode: '3379/conde.wired/mid-content/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 8,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T09:51:00.874Z',
              unitCode: '3379/conde.wired/hero/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 8,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T09:51:24.645Z',
              unitCode: '3379/conde.wired/rail/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 8.11,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T09:51:24.650Z',
              unitCode: 'rail_300x250_300x600',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 8.1,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T09:51:28.741Z',
              unitCode: 'hero_970x250',
              won: true
            },
            {
              bidder: 'rubicon',
              cpm: 8,
              currency: 'USD',
              hostname: 'www.wired.com',
              lib: 'googletag',
              outdated: false,
              time: '2021-10-25T09:51:28.806Z',
              unitCode: '3379/conde.wired/hero/homepage/bundle/1_0',
              won: true
            },
            {
              bidder: 'onetag',
              cpm: 0.18693144801,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:14:19.283Z',
              unitCode: 'moneytag-ldb-mtf-hp',
              won: true
            },
            {
              bidder: 'adagio',
              cpm: 0.545448,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:14:21.075Z',
              unitCode: 'moneytag-mpu-atf-hp',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 0.01209,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:14:30.211Z',
              unitCode: 'moneytag-ldb-mtf-hp',
              won: true
            },
            {
              bidder: 'eplanning',
              cpm: 0.465367,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:14:32.997Z',
              unitCode: 'moneytag-mpu-atf-hp',
              won: true
            },
            {
              bidder: 'smartadserver',
              cpm: 0.168747482496,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:14:37.080Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            },
            {
              bidder: 'adagio',
              cpm: 0.1,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:14:49.439Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            },
            {
              bidder: 'adagio',
              cpm: 1.8592792,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:14:49.483Z',
              unitCode: 'moneytag-mpu-atf-ros',
              won: true
            },
            {
              bidder: 'adagio',
              cpm: 1.9026312,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:24:48.495Z',
              unitCode: 'moneytag-mpu-atf-ros',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 0.009,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:24:48.522Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 0.009,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:29:22.817Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 0.009,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:30:42.834Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 0.006255,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:32:03.314Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            },
            {
              bidder: 'adagio',
              cpm: 0.507208,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:33:21.152Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            },
            {
              bidder: 'appnexus',
              cpm: 0.018,
              currency: 'USD',
              hostname: 'www.valeursactuelles.com',
              lib: 'pbjs',
              outdated: false,
              time: '2021-10-25T10:34:43.863Z',
              unitCode: 'moneytag-ldb-atf-ros',
              won: true
            }
          ]
        }
      ]
    }
  },
  computed: {
    itemified() {
      return this.itemify(this.items)
    }
  },
  methods: {
    itemify(tree) {
      if (typeof tree !== 'object') return tree

      if (tree.length) {
        const array = tree.flatMap(el => {
          const inner = this.itemify(el)
          if (typeof inner !== 'object') return { name: inner }
          else return inner
        })
        return [
          {
            name: `array with ${array.length} item${
              array.length === 1 ? '' : 's'
            }`,
            children: array
          }
        ]
      } else {
        const obj = Object.entries(tree).flatMap(([key, v]) => {
          const inner = this.itemify(v)
          if (typeof inner !== 'object') return { name: key, value: inner }
          else return { name: key, children: inner }
        })
        return {
          name: `object with ${obj.length} key${obj.length === 1 ? '' : 's'}`,
          children: obj
        }
      }
    }
  }
}
</script>
