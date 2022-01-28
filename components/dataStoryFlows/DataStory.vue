<template>
  <VContainer>
    <VRow>
      <VContainer>
        <div class="py-4">
          <h2 class="headline font-weight-light mb-4 primary--text">Title</h2>
          <div>
            Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
            imperdiet nec ut, sed euismod convenire principes at. Est et nobis
            iisque percipit, an vim zril disputando voluptatibus, vix an
            salutandi sententiae.
          </div>
        </div>
      </VContainer>
    </VRow>
    <VRow>
      <FlowItem :inputs="[{ id: 'S', name: 'test5', logo: 'mdiClose' }]">
        <template #opposite>
          <span class="headline font-weight-bold primary--text">test</span>
        </template>
        <template #content>
          <div class="py-4">
            <h2 :class="`headline font-weight-light mb-4 primary--text`">
              Lorem ipsum
            </h2>
            <div>
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              imperdiet nec ut, sed euismod convenire principes at. Est et nobis
              iisque percipit, an vim zril disputando voluptatibus, vix an
              salutandi sententiae. Lorem ipsum dolor sit amet, no nam oblique
            </div>
            <QuoteBlock
              text="Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              imperdiet nec ut, sed euismod convenire principes at."
              author="François Quellec"
            />
          </div>
        </template>
      </FlowItem>
      <FlowItem
        :inputs="[
          { id: 'A', name: 'test', logo: 'mdiHome' },
          { id: 'B', name: 'test2', logo: 'mdiClose' }
        ]"
      >
        <template #opposite>
          <span class="headline font-weight-bold primary--text">test</span>
        </template>
        <template #content>
          <div class="py-4">
            <h2 :class="`headline font-weight-light mb-4 primary--text`">
              Lorem ipsum
            </h2>
            <div>
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              imperdiet nec ut, sed euismod convenire principes at. Est et nobis
              iisque percipit, an vim zril disputando voluptatibus, vix an
              salutandi sententiae. Lorem ipsum dolor sit amet, no nam oblique
              veritus. Commune imperdiet nec ut, sed euismod convenire principes
            </div>
            <CodeBlock
              title="Example of code"
              :value="code"
              language="javascript"
              source-text="Source: "
              source-link-text="HestiaLabs"
              source-link-u-r-l="https://digipower.hestialabs.org/"
              readonly
            />
          </div>
        </template>
      </FlowItem>
      <FlowItem
        :inputs="[
          { id: 'C', name: 'test3', logo: 'mdiHome' },
          { id: 'D', name: 'test4', logo: 'mdiClose' }
        ]"
      >
        <template #opposite>
          <span class="headline font-weight-bold primary--text">test</span>
        </template>
        <template #content>
          <div class="py-4">
            <h2 :class="`headline font-weight-light mb-4 primary--text`">
              Lorem ipsum
            </h2>
            <div>
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              imperdiet nec ut, sed euismod convenire principes at. Est et nobis
              iisque percipit, an vim zril disputando voluptatibus, vix an
              salutandi sententiae.
            </div>
          </div>
        </template>
      </FlowItem>
      <FlowItem :inputs="[{ id: 'E', name: 'test4', logo: 'mdiClose' }]">
        <template #opposite>
          <span class="headline font-weight-bold primary--text">test</span>
        </template>
        <template #content>
          <div class="py-4">
            <h2 :class="`headline font-weight-light mb-4 primary--text`">
              Lorem ipsum
            </h2>
            <div>
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              imperdiet nec ut, sed euismod convenire principes at. Est et nobis
              iisque percipit, an vim zril disputando voluptatibus, vix an
              salutandi sententiae. Lorem ipsum dolor sit amet, no nam oblique
              veritus. Commune imperdiet nec ut, sed euismod convenire principes
              at. Est et nobis iisque percipit, an vim zril disputando
              voluptatibus, vix an salutandi sententiae. Lorem ipsum dolor sit
              amet, no nam oblique veritus. Commune imperdiet nec ut, sed
              euismod convenire principes at. Est et nobis iisque percipit, an
              vim zril disputando voluptatibus, vix an salutandi sententiae.
              Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
              imperdiet nec ut, sed euismod convenire principes at. Est et nobis
              iisque percipit, an vim zril disputando voluptatibus, vix an
              salutandi sententiae.
            </div>
          </div>
        </template>
      </FlowItem>
    </VRow>
    <VRow>
      <VContainer>
        <div class="py-4">
          <h2 :class="`headline font-weight-light mb-4 primary--text`">
            What we have learned ?
          </h2>
          <div>
            Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
            imperdiet nec ut, sed euismod convenire principes at. Est et nobis
            iisque percipit, an vim zril disputando voluptatibus, vix an
            salutandi sententiae.
          </div>
        </div>
      </VContainer>
    </VRow>
  </VContainer>
</template>
<script>
import LeaderLine from 'leader-line-new'
import FlowItem from './FlowItem.vue'
import QuoteBlock from './base/QuoteBlock.vue'
import CodeBlock from './base/CodeBlock.vue'
export default {
  components: { FlowItem, QuoteBlock, CodeBlock },
  data: () => ({
    chapters: [
      {
        color: 'cyan',
        year: '1960'
      },
      {
        color: 'green',
        year: '1970'
      },
      {
        color: 'pink',
        year: '1980'
      },
      {
        color: 'amber',
        year: '1990'
      },
      {
        color: 'orange',
        year: '2000'
      }
    ],
    lines: [],
    code: 'console.log("Hello World");\nconst test = true\nconsole.log("Test: ", test)'
  }),
  mounted() {
    const config = {
      color: 'purple',
      size: 8
    }
    this.$nextTick(() => {
      this.lines.push(
        new LeaderLine(
          document.getElementById('S'),
          document.getElementById('A'),
          config
        )
      )
      this.lines.push(
        new LeaderLine(
          document.getElementById('S'),
          document.getElementById('B'),
          config
        )
      )
      this.lines.push(
        new LeaderLine(
          document.getElementById('A'),
          document.getElementById('C'),
          config
        )
      )
      this.lines.push(
        new LeaderLine(
          document.getElementById('B'),
          document.getElementById('D'),
          config
        )
      )
      this.lines.push(
        new LeaderLine(
          document.getElementById('C'),
          document.getElementById('E'),
          config
        )
      )
      this.lines.push(
        new LeaderLine(
          document.getElementById('D'),
          document.getElementById('E'),
          config
        )
      )
    })
  },
  destroyed() {
    this.lines.forEach(l => l.remove())
  }
}
</script>
