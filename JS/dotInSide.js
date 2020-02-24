function pointInsideCircle(point, circle, r) {  
    if (r===0) return false  
    var dx = circle[0] - point[0]  
    var dy = circle[1] - point[1]  
    return dx * dx + dy * dy <= r * r  
}
let t = pointInsideCircle([0.5,0.3],[0.5,0.5],0.5)
console.log(t)