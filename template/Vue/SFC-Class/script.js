import { Vue, Component, Watch, Emit } from 'vue-property-decorator'

@Component({
  // Array<Object>
  mixins: [],
  // Object | Function
  extends: {},
  // name: 'SFCClass',
  // inheritAttrs: false,
  beforeCreate () {
  },
  // provide：Object | () => Object
  provide: {},
  // inject：Array<string> | { [key: string]: string | Symbol | Object }
  inject: [],
  props: {
  },
  methods: {
  },
  data () {
  },
  created () {
  },
  // template: '<div></div>',
  // render: (h) => {return h('div', {})},
  beforeMounted () {},
  filters: {},
  computed: {
  },
  components: {},
  mounted () {},
  activated () {},
  watch: {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  destroyed () {},
})
export default class SFCClass extends Vue {

  methodsFn () {}

  @Emit()
  addToCount (n) {
    this.msg = n
  }

  mounted () {
  }

  @Watch('msg')
  watch_msg (val, oldVal) {
  }
}

// *****在页面首次加载执行顺序有如下：

// beforeCreate //在实例初始化之后、创建之前执行

// created //实例创建后执行

// beforeMounted //在挂载开始之前调用

// filters //挂载前加载过滤器

// computed //计算属性

// directives-bind //只调用一次，在指令第一次绑定到元素时调用

// directives-inserted //被绑定元素插入父节点时调用

/* mounted的时候 是不保证组件已在document中。也就是说组件还没有被激活，所以activated可以理解为在mounted之后执行。
在定义变量和执行函数的时候需要注意放置的钩子函数位置。
其次源码实现中，在渲染组件时，也是会先判断是否组件是否挂载过，如果没有会先执行mount的hook函数。 */
// activated //keek-alive组件被激活时调用，则在keep-alive包裹的嵌套的子组件中触发

// mounted //挂载完成后调用

// {{}} //mustache表达式渲染页面

// *****修改页面input时，被自动调用的选项顺序如下：

// watch //首先先监听到了改变事件

// filters //过滤器没有添加在该input元素上，但是也被调用了

// beforeUpdate //数据更新时调用，发生在虚拟dom打补丁前

// directived-update //指令所在的组件的vNode更新时调用，但可能发生在其子vNode更新前

// directives-componentUpdated//指令所在的组件的vNode及其子组件的vNode全部更新后调用

// updated //组件dom已经更新

// *****组件销毁时，执行顺序如下：

// beforeDestroy //实例销毁之前调用

// directives-unbind //指令与元素解绑时调用，只调用一次

// deactivated //keep-alive组件停用时调用

// destroyed //实例销毁之后调用
