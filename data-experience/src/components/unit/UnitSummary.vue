<template>
  <div v-if="fileManager !== null">
    <VCard class="pa-2 mb-6" flat>
      <VCardTitle v-t="k('cardTitle')" class="justify-center" />
      <VCardText>
        <!-- https://kazupon.github.io/vue-i18n/guide/pluralization.html -->
        <i18n :path="k('summaryHeading.main')" tag="span">
          <template #file>
            <span class="font-weight-bold">{{ $tc(k('summaryHeading.file'), nFiles, { n: $n(nFiles) }) }}</span>
          </template>
          <template #dataSizeString>
            (<span class="font-weight-bold">{{ dataSizeString }}</span>)
          </template>
          <template #datapoint>
            <span class="font-weight-bold">{{ $tc(k('summaryHeading.datapoint'), nDataPoints, { n: $n(nDataPoints) }) }}</span>
          </template>
        </i18n><span>:</span>
        <ul v-if="filesInformation">
          <li
            v-for="({ globalDescription, topFiles }, i) in filesInformation"
            :key="i"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="globalDescription" />
            <span v-for="({ filename, description }, j) in topFiles" :key="j">
              <a @click="onFileClick(filename)"><u>{{ fileManager.getShortFilename(filename) }}</u></a><span>{{ description }}</span><span v-if="j < topFiles.length - 1">, </span>
            </span>
          </li>
        </ul>
      </VCardText>
    </VCard>
  </div>
</template>

<script>
import { mapState } from '@/utils/store-helper'
import { sum, sumBy, take, isUndefined, mapValues, identity, groupBy, sortBy } from 'lodash-es'
import { humanReadableFileSize } from '~/utils/utils'

const plurify = (word, n) => (n === 1 ? word : `${word}s`)

export default {
  name: 'UnitSummary',
  data() {
    return {
      group2ext: {
        'audio file': ['mp3', 'm4a', 'wav', 'aac', 'webp'],
        'image file': ['jpg', 'jpeg', 'png', 'gif', 'bnp'],
        'video file': ['avi', 'mov', 'mp4', 'mpg'],
        document: ['pdf', 'html', 'doc', 'docx', 'rtf', 'odt'],
        spreadsheet: ['xls', 'xlsx', 'ods'],
        'archive file': ['zip', '7z', 'rar', 'gz'],
        'data file': ['json', 'csv', 'tsv', 'xml'],
        'text file': ['txt', 'md'],
        other: []
      },
      computeNPoints: false,
      nDataPoints: null,
      filesInformation: []
    }
  },
  computed: {
    ...mapState(['fileManager']),
    ext2group() {
      return Object.fromEntries(
        Object.entries(this.group2ext).flatMap(entry =>
          entry[1].map(ext => [ext, entry[0]])
        )
      )
    },
    nFiles() {
      return this.fileManager.fileList.length
    },
    totalSize() {
      return sumBy(this.fileManager.fileList, f => f.file.size)
    },
    dataSizeString() {
      return humanReadableFileSize(this.totalSize)
    },
    fileExts() {
      return this.fileManager.fileList
        .map(f => f.name.match(/^.+\.(.+?)$/)?.[1])
        .filter(m => !isUndefined(m))
    },
    sortedGroupCounts() {
      const groups = this.fileExts.map(ext => this.ext2group[ext])
      const occurrences = mapValues(
        groupBy(groups, identity),
        v => v.length
      )
      return sortBy(Object.entries(occurrences), ([group, count]) =>
        group === 'other' ? 1 : -count
      )
    }
  },
  watch: {
    fileManager: {
      immediate: true,
      handler() {
        if (!this.fileManager) { return }
        this.completeGroupsTable()
        this.setExtensionTexts()
        if (this.computeNPoints) {
          this.setNumberOfDataPoints()
        }
      }
    }
  },
  methods: {
    k(key) {
      return `unit-summary.${key}`
    },
    onFileClick(filename) {
      this.$store.commit('xp/setFileExplorerCurrentItem', { filename })
      // this.$store.commit('xp/setCurrentTab', 'file-explorer')
    },
    async setNumberOfDataPoints() {
      this.nDataPoints = sum(
        await Promise.all(
          this.fileManager
            .getFilenames()
            .map(async f => await this.fileManager.getNumberOfDataPoints(f))
        )
      )
    },
    completeGroupsTable() {
      // Add unknown extensions to the 'other' group
      for (const ext of this.fileExts) {
        if (!(ext in this.ext2group) && !this.group2ext.other.includes(ext)) {
          this.group2ext.other.push(ext)
        }
      }
    },
    async setExtensionTexts() {
      const showAtMost = 3
      const pointsPerFile = await Promise.all(
        this.fileManager
          .getFilenames()
          .map(async f => [
            f,
            this.computeNPoints
              ? await this.fileManager.getNumberOfDataPoints(f)
              : 0
          ])
      )
      this.filesInformation = this.sortedGroupCounts.map(([group, c]) => {
        const re = new RegExp(`.+\\.${this.group2ext[group].join('|')}$`)
        const filterFunc = ([f, _n]) => re.test(f)
        const files = pointsPerFile.filter(filterFunc)
        const shownFiles = take(
          sortBy(files, ([_f, n]) => -n),
          showAtMost
        )
        const nPointsGroup = sumBy(files, ([_f, n]) => n)
        const topFiles = shownFiles.map(([f, nPoints]) => ({
          filename: f,
          description: `${
            nPoints === 0
              ? ''
              : ` (${nPoints.toLocaleString()} ${plurify(
                  group === 'text file' ? 'line' : 'datapoint',
                  nPoints
                )})`
          }`
        }))
        const globalDescription = `<b>${c} ${plurify(
          group === 'other' ? 'other file' : group,
          c
        )}</b>${
          nPointsGroup > 0
            ? ` (${nPointsGroup.toLocaleString()} ${plurify(
                group === 'text file' ? 'line' : 'datapoint',
                nPointsGroup
              )})`
            : ''
        }${files.length > showAtMost ? ' including: ' : ':'}`
        return { topFiles, globalDescription }
      })
    }
  }
}
</script>
