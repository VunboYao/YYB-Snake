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
    ```css
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
    ```javascript
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
  
- ~~实现数组网格地图, 并添加初始化的 snake~~错误实现
- **此处数组网格地图应在随机获取坐标方法内.每次刷新.否则多次移动后,数组中没有多余的值可以获取.导致错误.**
    ```javascript
      // 数组地图行数, 列数
     // 默认每一个网格宽高 50
      // col 与 row 在判断边界值时需要用到,所以此处设置为实例属性
     let col = this.col = parseInt(this.width) / 50;
     let row = this.row = parseInt(this.height) / 50;

     // 创建数组网格地图-----------------error
     this.mapArr = []
     for (let c = 0; c < col; c++) {
         for (let r = 0; r < row; r++) {
             this.mapArr.push({x: c, y: r})
         }
     }----------------------------------error

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
    - 最后, 在 constructor 中调用 **this.foodRender()** 方法, 生成 food
    - **解决错误: 创建数组网格放在该方法内,每次获取全新的数组网格,删除蛇身部分.随机获取坐标值.**
    ```javascript
      // 1.生成食物随机坐标
     generatePlace() {
          // 0. 创建数组网格地图
         this.mapArr = []
         for (let c = 0; c < this.col; c++) {
             for (let r = 0; r < this.row; r++) {
                 this.mapArr.push({x: c, y: r})
             }
         }
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
         // 如果数组网格在实例属性中定义,多次移动后,x,y值无法获取.
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

- 实现 snake, 在 constructor 中调用 **this.snakeRender()** 方法, 生成 snake, 每次移动前需要删除上一次的 snake.
    ```javascript
    // 3. 生成 snake
    snakeRender() {
        // 删除之前的蛇
        let aSnake = document.querySelectorAll('.snake')
        aSnake.forEach(item => {
            item.parentNode.removeChild(item)
        })
        /*
        * 1. 根据 this.bodies 中 (x, y) 坐标值,绘制 snake
        * 2. type === 1 的是 snake head
        * 3. 添加至 map 中
        * */
        this.bodies.forEach(item => {
            let oDiv = document.createElement('div');
            oDiv.className = 'snake'
            oDiv.style.position = 'absolute';
            oDiv.style.top = 50 * item.y + 'px';
            oDiv.style.left = 50 * item.x + 'px';
            oDiv.style.width = '50px';
            oDiv.style.height = '50px';
            if (item.type === 1) {
                oDiv.style.background = 'red'
            } else {
                oDiv.style.background = 'skyblue'
            }
            this.map.appendChild(oDiv)
        })
    } 
    ```

- 实现 snake 移动
    - 首先实现方向的判定, 通过在 constructor 中判断用户按下了哪个**方向**键(默认向右), 并添加中间变量值 **this.currentDirection** 记录当前方向, 如果按下的方向 **(ev.key)** 与当前记录方向
 **this.currentDirection** **相反**, 则方向值 **this.key** 设置依旧为当前方向, 如果不是相反方向,则设置为新的方向.
    ```javascript
    // 方向操控
    document.body.onkeydown = ev => {
        switch (ev.key) {
                /* 判断按下的方向,如果与当前方向相反,则无效 */
            case 'ArrowUp':
                if (this.currentDirection === 'ArrowDown') {
                    this.key = 'ArrowDown'
                } else {
                    this.key = 'ArrowUp'
                }
                break
            case 'ArrowLeft':
                if (this.currentDirection === 'ArrowRight') {
                    this.key = 'ArrowRight'
                } else {
                    this.key = 'ArrowLeft'
                }
                break
            case 'ArrowDown':
                if (this.currentDirection === 'ArrowUp') {
                    this.key = 'ArrowUp'
                } else {
                    this.key = 'ArrowDown'
                }
                break
            case 'ArrowRight':
                if (this.currentDirection === 'ArrowLeft') {
                    this.key = 'ArrowLeft'
                } else {
                    this.key = 'ArrowRight'
                }
                break
            default:
                this.key = 'ArrowRight'
        }
    }
    ```
    - 在 **snakeMove()** 中, 移动蛇节, 通过判断 **this.key** 的方向值,设置对应方向的(x,y)值. 并更新当前方向值.
    ```javascript
     snakeMove() {
             /*
             * 1. 移动之前获取当前 snake 的最后一个节点
             * 2. 当 snake 吃到食物时, 添加该节点至 snake 最后
             * 3. 蛇节每个节点等于上一个节点的位置.
             * 4. 蛇头通过方向控制 (x, y)
             * */
             this.originPosition = {
                 x: this.bodies[this.bodies.length - 1].x,
                 y: this.bodies[this.bodies.length - 1].y,
                 type: 0
             }
     
             // 蛇节移动
             for (let i = this.bodies.length - 1; i > 0; i--) {
                 this.bodies[i].x = this.bodies[i - 1].x
                 this.bodies[i].y = this.bodies[i - 1].y
             }
     
             // 蛇头移动
             let oHead = this.bodies[0]
             switch (this.key) {
                 case 'ArrowUp':
                     oHead.y -= 1
                     this.currentDirection = 'ArrowUp'
                     break
                 case 'ArrowRight':
                     oHead.x += 1
                     this.currentDirection = 'ArrowRight'
                     break
                 case 'ArrowDown':
                     oHead.y += 1
                     this.currentDirection = 'ArrowDown'
                     break
                 case 'ArrowLeft':
                     oHead.x -= 1
                     this.currentDirection = 'ArrowLeft'
                     break
                 default:
                     oHead.x += 1
                     break
             }
         }
    ```
 
- 判断边界撞墙游戏结束, 撞到自身时游戏结束.当蛇头的(x,y)与食物的(x,y)相等时,删除当前食物,生成新的食物,并在蛇身后长度+1(上一次移动的最后一个节点)
    ```javascript
    inspection() {
        let head = this.bodies[0]
        /* 撞墙GG */
        if (head.x >= this.col || head.y >= this.row || head.x < 0 || head.y < 0) {
            alert('苦海无涯, 回头是岸~')
            clearInterval(this.timer)
            return false
        }
        /* 自杀GG */
        // 最少四个才可能吃到自己
        for (let i = 4; i < this.bodies.length; i++) {
            if (head.x === this.bodies[i].x && head.y === this.bodies[i].y) {
                alert('本是同根生,相煎何太急~')
                clearInterval(this.timer)
                return false
            }
        }

        /* 吃食物 */
        // 判定当前头坐标与食物坐标
        if (head.x === this.foodCoordinate.x && head.y === this.foodCoordinate.y) {
            // 1.删除当前食物
            this.food.parentNode.removeChild(this.food);

            //2. 生成新的食物
            this.foodRender()

            // 3.蛇身加1
            this.bodies.push(this.originPosition)
        }
        return true
    }
    ```
  
## 首次错误问题

- 当移动多次后, 报错无法获取值, 因为获取坐标值时,在数组网格中删除当前蛇对应的坐标, 但是并没有刷新当前网格,所以导致多次后无法获取值.
- 数组网格的定义不能在实例属性中定义,应定义在随机获取食物坐标方法内.
