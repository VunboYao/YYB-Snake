# YYB-Snake
JavaScript 实现贪吃蛇

## 实现思路
- 生成地图, 食物, snake
- 食物的随机显示, 并且与 snake 不重合
- snake 移动, 吃到食物则食物消失, snake 长度 +1, 并生成新的食物
- 边界撞墙与 snake 自身相撞, 游戏结束.

## 遇到的问题:
 
- 首先食物随机产生, 最初假设地图是一个坐标, 食物通过 x y 坐标定位到地图中, 但无法排除 snake 的坐标, 因此出现食物与 snake 重合问题.
- 其次, snake 在移动中吃到食物时, 最后一个节点数加 1, 此节点即为上一次的最后一个节点.
- 目前解决办法: 将地图生成一个**二维数组**坐标网格, 食物与 snake 均在此网格中定位. 每次判断 snake 的组成数组, 并将其在网格中删除. 随机遍历剩下二维数组中的任意坐标为新的食物位置.

## 具体实现

- 使用纯 JS 的方式实现整个游戏的布局, 为了效果, 适当添加容器布局居中,以及背景色效果.
    ```
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    html,body {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, #464646, #6f4413);
    }
    div {
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.25);
    } 
    ```
    
- 预先定义的 CSS 只有以上这些. 接下来均为 JS 实现. 通过定义**地图**类, 传入三个参数, 构建一个基础的 **Map**
    ```
     class Snake {
         constructor(param = {}) {
             // 参数为空时, 基础样式
             this.width = param.width || 600;
             this.height = param.height || 600;
             this.bgColor = param.bgColor || '#ddd';
     
             /*
             * 1.设置地图基础样式
             * 2.设置为相对定位, food 与 snake 构建时基于 map 定位
             * 3.添加地图至 dom 结构中, 并返回该 Map
             * */
             let oMap = document.createElement('div');
             oMap.style.position = 'relative';
             oMap.style.width = parseInt(this.width) + 'px';
             oMap.style.height = parseInt(this.height) + 'px';
             oMap.style.background = this.bgColor;
     
             document.body.appendChild(oMap);
             this.map = oMap;
         }
     }
    ```
  
- 实现数组网格地图, 并添加初始化的 snake
    ```
      // 数组地图行数, 列数
     // 默认每一个网格宽高 50
     let col = parseInt(this.width) / 50;
     let row = parseInt(this.height) / 50;

     // 创建数组网格地图
     this.mapArr = []
     for (let c = 0; c < col; c++) {
         for (let r = 0; r < row; r++) {
             this.mapArr.push({x: c, y: r})
         }
     }

     // 初始 snake
     this.bodies = [
         { x: 3, y: 1, type: 1},
         { x: 2, y: 1, type: 0},
         { x: 1, y: 1, type: 0}
     ]
    ```    

- 实现随机食物. 
    - 通过 **generatePlace()** 方法, 将 snake 的坐标值在 **地图网格数组** 中删除, 随机获取剩下数组的索引值, 根据索引获得 (x, y) 的坐标值.
    - 在 **foodRender()** 方法中, 根据 generatePlace() 中获取的坐标值, 设置 food 在 map 中的位置.
    - 最后, 在 constructor 中调用 **this.foodRender()** 方法, 生成食物
    
    ```
      // 1.生成食物随机坐标
     generatePlace() {
         // 1.查询 snake 当前在数组地图中的索引, 根据索引将 snake 从数组网格地图中删除
         this.bodies.forEach(item => {
             let snakeBody = {x: item.x, y: item.y}
             let index = this.mapArr.findIndex(value => {
                 return snakeBody.x === value.x && snakeBody.y === value.y;
             });
             this.mapArr.splice(index, 1);
         })
 
         // 2. 随机获取网格数组任一索引
         let randomIndex = Math.floor(Math.random() * this.mapArr.length);
 
         // 3. 解构获取坐标值返回
         let {x,y} = this.mapArr[randomIndex];
         return {x,y}
     }
 
     // 2. 根据随机坐标创建食物
     foodRender() {
         /*
         * 1. 默认食物大小为50 * 50
         * 2. 根据坐标设置 food 在 map 中的位置
         * 3. 将 food 添加到 map 中
         * */
         let oFood = document.createElement('div');
         oFood.style.position = 'absolute';
         oFood.style.width = '50px';
         oFood.style.height = '50px';
         oFood.style.background = 'green';
 
         // 1.解构获取坐标, 后续需要判断坐标与蛇头位置,所以设置为实例属性
         this.foodCoordinate = this.generatePlace();
 
         // 2.设置位置
         oFood.style.left = this.foodCoordinate.x * 50 + 'px';
         oFood.style.top = this.foodCoordinate.y * 50 + 'px';
 
         // 3.添加到 map 中
         this.map.appendChild(oFood)
 
         // 4.实例属性,便于获取
         this.food = oFood;
     }
    ```






 