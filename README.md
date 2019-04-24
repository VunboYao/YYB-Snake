# YYB-Snake
JavaScript 实现贪吃蛇

## 实现思路
- 生成地图, 食物, snake
- 食物的随机显示, 并且与 snake 不重合
- snake 移动, 吃到食物则食物消失, snake 长度 +1, 并生成新的食物
- 边界撞墙与 snake 自身相撞, 游戏结束.

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
    
- 预先定义的 CSS 只有以上这些. 接下来均为 JS 实现. 通过定义**地图**类, 传入三个参数, 构建一个基础的 **Map**, 并将该地图返回, 因为食物与 Snake 的定位时需要引用到地图.    