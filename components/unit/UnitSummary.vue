<template>
  <div v-if="fileManager !== null">
    <VCard class="pa-2 mb-6" flat>
      <VCardTitle class="justify-center">
        Here's a summary of what we have found
      </VCardTitle>
      <VCardText>
        Analysed <b>{{ nFiles }}</b> {{ plurify('file', nFiles) }} (<b>{{
          dataSizeString
        }}</b
        >)
        <template v-if="nDataPoints">
          and found <b>{{ nDataPoints.toLocaleString() }}</b>
          {{ plurify('datapoint') }}
        </template>
        :
        <ul v-if="filesInformation">
          <li
            v-for="({ globalDescription, topFiles }, i) in filesInformation"
            :key="i"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="globalDescription"></span>
            <span v-for="({ filename, description }, j) in topFiles" :key="j">
              <a @click="onFileClick(filename)"
                ><u>{{ fileManager.getShortFilename(filename) }}</u></a
              ><span>{{ description }}</span
              ><span v-if="j < topFiles.length - 1">, </span>
            </span>
          </li>
        </ul>
      </VCardText>
    </VCard>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import { humanReadableFileSize, plurify } from '~/manifests/utils'

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
      return _.sumBy(this.fileManager.fileList, f => f.size)
    },
    dataSizeString() {
      return humanReadableFileSize(this.totalSize)
    },
    fileExts() {
      return this.fileManager.fileList
        .map(f => f.name.match(/^.+\.(.+?)$/)?.[1])
        .filter(m => !_.isUndefined(m))
    },
    sortedGroupCounts() {
      const groups = this.fileExts.map(ext => this.ext2group[ext])
      const occurrences = _.mapValues(
        _.groupBy(groups, _.identity),
        v => v.length
      )
      return _.sortBy(Object.entries(occurrences), ([group, count]) =>
        group === 'other' ? 1 : -count
      )
    }
  },
  watch: {
    fileManager: {
      immediate: true,
      handler() {
        if (!this.fileManager) return
        this.completeGroupsTable()
        this.setExtensionTexts()
        if (this.computeNPoints) {
          this.setNumberOfDataPoints()
        }
      }
    }
  },
  methods: {
    plurify,
    onFileClick(filename) {
      this.$store.commit('setFileExplorerCurrentItem', { filename })
      this.$emit('switch-tab', 'file-explorer')
    },
    async setNumberOfDataPoints() {
      this.nDataPoints = _.sum(
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
        const shownFiles = _.take(
          _.sortBy(files, ([_f, n]) => -n),
          showAtMost
        )
        const nPointsGroup = _.sumBy(files, ([_f, n]) => n)
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
