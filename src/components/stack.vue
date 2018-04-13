<template>
  <div class="main">
    <div class="mid-center">
      <div class="stack-wrapper">
        <ul class="stack">
          <li class="stack-item" v-for="(item,index) in pages" :style="[transform(index),transformIndex(index)]"
            @touchstart.stop.capture.prevent="touchstart"
            @touchmove.stop.capture.prevent="touchmove"
            @touchend.stop.capture.prevent="touchend"
            @mousedown.stop.capture.prevent="touchstart"
            @mouseup.stop.capture.prevent="touchend"
            @mousemove.stop.capture.prevent="touchmove"
            @-webkit-transition-end="onTransitionEnd(index)"
            @transitionend="onTransitionEnd(index)">
            <img :src="item.src">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default{
        props: {
          pages:{
            type: Array,
            default:function(){
              return [
                {src:"../static/img/1.png"},
                {src:"../static/img/2.png"},
                {src:"../static/img/3.png"},
                {src:"../static/img/4.png"},
                {src:"../static/img/5.png"},
                {src:"../static/img/6.png"},
                {src:"../static/img/7.png"}
              ]
            }
          }
        },
        data(){
          return{
            //basicdata 数据包含组件的基本数据
            basicdata: {
              currentPage: 0,
              start:{},
              end:{},
            },
            //temporaryData数据包含组件临时数据
            temporaryData: {
              opacity: 1,
              zIndex: 10,
              visble: 3,  // 记录默认显示堆叠数visble
              poswidth: '0',  //记录位移
              posheight: '0', //记录位移
              lastPosWidth: '0', //记录上次位移最终位置
              lastPosHeight: '0', //记录上次位移最终位置
              tracking:false ,  //是否在滑动，防止多次操作，影响体验
              animation: false, //首图是否启用动画效果，默认false
              opacity:1,
              swipe:false, //onTransition判断
              showPage:0,
              perIndex:''
            }
          }
        },
        computed:{
          //划出面积比例
          offsetRatio(){

            console.log(this.$el)
            let width = this.$refs.offsetWidth
            let height = this.$el.offsetHeight
            let offsetWidth = width - Math.abs(this.temporaryData.poswidth)
            let offsetHeight = width - Math.abs(this.temporaryData.posheight)
            let ratio = 1-(offsetWidth * offsetHeight)/(width * height) ||0
            return ratio >1 ? 1:ratio
          },
          //划出宽度比例
          offsetWidthRatio(){
            let width = this.$el.offsetWidth
            let offsetWidth = width  - Math.abs(this.temporaryData.poswidth)
            let ratio = 1 - offsetWidth / width || 0
            return ratio
          }
        },
        mounted(){
          //绑定事件
        this.$on('next',()=>{
          this.next()
        })
        this.$on('prev',()=>{
          this.prev()
        })
        document.addEventListener('touchmove',(e)=>{
          e.preventDefault()
        })
          this.$nextTick(()=>{
            debugger
            this.offsetRatio
          })
      },
        methods:{
          touchstart (e){
            if(this.temporaryData.tracking){
              return
            }
            //是否为touch
            if(e.type=='touchstart') {
              if (e.touches.length > 1) {
                this.temporaryData.tracking = false;
                return
              }else {
                // 记录起始位置
                console.log(this.temporaryData.tracking)
                this.basicdata.start.t = new Date().getTime()
                this.basicdata.start.x = e.targetTouches[0].clientX
                this.basicdata.start.y = e.targetTouches[0].clientY
                this.basicdata.end.x = e.targetTouches[0].clientX
                this.basicdata.end.y = e.targetTouches[0].clientY
              }
              //pc 操作
            }else{
                this.basicdata.start.t = new Date().getTime
                this.basicdata.start.x = e.clientX
                this.basicdata.start.y = e.clientY
                this.basicdata.end.x = e.clientX
                this.basicdata.end.y = e.clientY
            }
            this.temporaryData.tracking = true
            this.temporaryData.animation = false
          },
          touchmove (e){
            //记录滑动位置
            if(this.temporaryData.tracking && !this.temporaryData.animation){
              if(e.type === 'touchmove'){
                this.basicdata.end.x = e.targetTouches[0].clientX
                this.basicdata.end.y = e.targetTouches[0].clientY
              }else{
                this.basicdata.end.x = e.clientX
                this.basicdata.end.y = e.clientY
              }
              //计算滑动值
              this.temporaryData.poswidth = this.basicdata.end.x - this.basicdata.start.x
              this.temporaryData.posheight = this.basicdata.end.y - this.basicdata.start.y
            }
          },
          touchend (e) {
            this.temporaryData.tracking = false
            this.temporaryData.animation = true
            //滑动结束，触发判断
            //简单判断滑动宽度超出100像素时触发
            if (Math.abs(this.temporaryData.poswidth) >= 100) {
              //最终位移加单设定为x轴200像素的偏移
              let ratio = Math.abs(this.temporaryData.posheight / this.temporaryData.poswidth)
              console.log(ratio)
              this.temporaryData.poswidth = this.temporaryData.poswidth >= 0 ? this.temporaryData.poswidth + 200 : this.temporaryData.poswidth - 200
              this.temporaryData.posheight = this.temporaryData.posheight >= 0 ? Math.abs(this.temporaryData.poswidth * ratio) : -Math.abs(this.temporaryData.poswidth * ratio)
              this.temporaryData.opacity = 0
              this.temporaryData.swipe = true
              //记录最终滑动距离
              this.temporaryData.lastPosWidth = this.temporaryData.poswidth
              this.temporaryData.lastPosHeight = this.temporaryData.posheight
              //currentOage+1 引发排序变化
              this.basicdata.currentPage += 1
              //curentPage切换， 整体dom进行变化，把第一层滑动设置零
              this.$nextTick(() => {
                this.temporaryData.poswidth = 0
                this.temporaryData.posheight = 0
                 this.temporaryData.swipe = false
              })
              //不满足条件则滑入
            }else{
              this.temporaryData.poswidth = 0
              this.temporaryData.posheight = 0
              this.temporaryData.swipe = false
            }
          },
          nextTick(){
            //记录最终滑动距离
            this.temporaryData.lastPosWidth = this.temporaryData.poswidth
            this.temporaryData.lastPosHeight = this.temporaryData.posheight
            this.temporaryData.lastRotate = this.temporaryData.rotate
            this.temporaryData.lastZindex = 20
            //循坏currentPage
            this.temporaryData.currentPage = this.temporaryData.currentPage ===this.pages.length -1?0:this.temporaryData.currentPage +1
            //currentPage切换，整体dom进行变化，把第一层滑动设置最低
            this.$nextTick(()=>{
              this.temporaryData.poswidth = 0
              this.temporaryData.posheight = 0
              this.temporaryData.opacity =1
              this.temporaryData.rotate = 0
            })
          },
          onTransitionEnd (index){
            //dom 发生变化后，正在执行的动画滑动序列已经变为上一层
            if(this.temporaryData.swipe && index === this.basicdata.currentPage - 1){
              this.temporaryData.animation = true
              this.temporaryData.lastPosWidth = 0
              this.temporaryData.lastPosHeight = 0
              this.temporaryData.swipe = false
            }
          },
          prv(){
            this.temporaryData.tracking = false
            this.temporaryData.animation = true
            //计算划出后最终位置
            let width = this.$el.offsetWidth = this.$el.offsetWidth
            this.temporaryData.poswidth = -width
            this.temporaryData.posheight = 0
            this.temporaryData.opacity = 0
            this.temporaryData.rotate = '-3'
            this.temporaryData.swipe = true
            this.nextTick()
          },
          next(){
            this.temporaryData.tracking = false
            this.temporaryData.animation = true
            //计算划出后最终位置
            let width = this.$el.offsetWidth
            this.temporaryData.poswidth = width
            this.temporaryData.posheight = 0
            this.temporaryData.opacity = 0
            this.temporaryData.rotate = "3"
            this.temporaryData.swipe = true
            this.nextTick()
          },
          rotateDirection(){
            if(this.temporaryData.poswidth<=0){
              return -1
            }else{
              return 1
            }
          },
          angleRatio(){
            let height = this.$el.offsetHeight
            let offsetY = this.temporaryData.offsetY
            let ratio = -1 * (2*offsetY/height -1)
            return ratio || 0
          },
          instack(index,currentPage){

            let stack = []
            let visble = this.temporaryData.visble
            let length = this.pages.length
            for(let i = 0;i<visble;i++){
              if(currentPage+i<length){
                stack.push(currentPage +i)
              }else{
                stack.push(currentPage+i-length)
              }
            }
            return stack.indexOf(index)>=0
          },
          // 非首页样式切换
          transform (index){
            debugger
            let style = {}
            let visble = this.temporaryData.visble
            let currentPage = this.basicdata.currentPage
            let lengths = this.pages.length
            let lastPage = currentPage == 0 ? this.pages.length-1 : currentPage-1
            if(index == this.basicdata.currentPage){
              console.log(index == this.basicdata.currentPage)
              return
            }
            if(this.instack(index,currentPage)){
              let perIndex = index-currentPage > 0 ? index-currentPage : index-currentPage+lengths
              style['opacity'] = 1
              style['transform'] = 'translate3D('+'0px'+','+'0px'+','+ -1*(perIndex-this.offsetRatio)*60+'px'+')'
              style['zIndex'] = perIndex
              console.log(1)
            }else{
              style['transform'] ='translate3D('+'0px'+','+'0px'+','+-1*visble*60+'px'+')'
              style['zIndex'] = -1
              console.log(2)
            }
            return style
          },
          //首页样式切换
          transformIndex (index){
            //处理3D效果
            if(index === this.basicdata.currentPage){
              let style ={}
              style['transform'] = 'translate3D('+this.temporaryData.poswidth +'px' + ',' +this.temporaryData.posheight + 'px' +',0px)'
              style['opacity'] = 1
              style['zIndex'] = 10
              if(this.temporaryData.animation){
                style['transitionTimingFunction'] = 'ease'
                style['transitionDuration'] = 300 +'ms'
              }
              return style
            }
          }
          }
        }

</script>

<style scoped>
  *{margin: 0;padding: 0;}

  .main{display: flex;
    display: -moz-flex;
    display:-webkit-flex;
    justify-content: center;
    height: 100%;}
  .stack-wrapper{
    z-index: 1000;
    width: 320px;
    height: 320px;
    padding: 0;
    listy-style:none;}
  .stack{width: 100%;height: 100%;position: relative;perspective: 1000px;perspective-origin: 50% 150%;-webkit-perspective: 1000px;
    -moz-perspective: 1000px;
    -ms-perspective: 1000px;
    perspective: 1000px;-webkit-perspective-origin: 50% 150%;
    -moz-perspective-origin: 50% 150%;
    -ms-perspective-origin: 50% 150%;
    perspective-origin: 50% 150%;}
  .stack-item{
    background: #fff;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    text-align: center;
    overflow: hidden;
    position: absolute;}
  .stact-item img{
    max-swidth: 100%;
    display: block;}
</style>
