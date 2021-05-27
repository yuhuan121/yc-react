import ajax from "./ajax";
const BASE = 'https://yc.jsrunning.club'

// 登录接口
export const reqLogin = (data) => ajax(BASE + '/login', data, 'POST', { headers:{"Content-Type": "application/x-www-form-urlencoded"}})

// 所有学生信息
export const reqAllStu = () => ajax(BASE + '/student/getAll', 'GET')
// 添加学生
export const reqStuAdd = (data) => ajax(BASE + '/student/add', (data), 'POST', { headers:{"Content-Type": "application/json"}})


// 教练信息
export const reqAllCoach = () => ajax(BASE + '/coach/getAll', 'GET')
// 添加教练
export const reqCoachAdd = (data) => ajax(BASE + '/coach/add', (data), 'POST', { headers:{"Content-Type": "application/json"}})


// 接送地点信息
export const reqAllPlan = () => ajax(BASE + '/plan/getAll', 'GET')
// 添加接送信息
export const reqPlanAdd = (data) => ajax(BASE + '/plan/add', (data), 'POST', { headers:{"Content-Type": "application/json"}})

// 所有预约记录
export const reqAllBooking = () => ajax(BASE + '/booking/getAll', 'GET')

