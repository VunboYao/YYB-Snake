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

        // A. food
        this.foodRender();
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
}
















