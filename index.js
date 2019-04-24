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

        // 数组地图行数, 列数
        // 默认每一个网格宽高 50
        let col = this.col = parseInt(this.width) / 50;
        let row = this.row = parseInt(this.height) / 50;

        // 创建数组网格地图
        this.mapArr = []
        for (let c = 0; c < col; c++) {
            for (let r = 0; r < row; r++) {
                this.mapArr.push({x: c, y: r})
            }
        }

        // 初始 snake
        this.bodies = [
            {x: 3, y: 1, type: 1},
            {x: 2, y: 1, type: 0},
            {x: 1, y: 1, type: 0}
        ]

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

        // A. food
        this.foodRender();

        // B. snake
        this.snakeRender();

        // C. update
        this.update();
    }

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
        let {x, y} = this.mapArr[randomIndex];
        return {x, y}
    }

    // 2.根据随机坐标创建食物
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

    // 3.生成 snake
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

    // 4.snake 移动
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

    // 5.判断
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

    // 6. update
    update() {
        this.timer = setInterval(() => {
            // 1.移动蛇
            this.snakeMove()

            // 2.验证
            let flag = this.inspection()
            if (!flag) {
                return
            }
            // 3.蛇渲染
            this.snakeRender()
        }, 300)
    }
}
















