import { combineReducers } from '@reduxjs/toolkit'
import { authSlice } from './slices/auth.slice'
import { authApi } from './apis/auth.api'
import { eventApi } from './apis/event.api'
import { userApi } from './apis/user.api'
import { statisticApi } from './apis/statistics.api'
import { feedbackApi } from './apis/feedback.api'
import { attendanceApi } from './apis/attendance.api'
import { notificationApi } from './apis/notification.api'
import { areaApi } from './apis/area.api'

const rootReducer = combineReducers({
   [authSlice.name]: authSlice.reducer,
   [authApi.reducerPath]: authApi.reducer,
   [eventApi.reducerPath]: eventApi.reducer,
   [statisticApi.reducerPath]: statisticApi.reducer,
   [userApi.reducerPath]: userApi.reducer,
   [feedbackApi.reducerPath]: feedbackApi.reducer,
   [attendanceApi.reducerPath]: attendanceApi.reducer,
   [notificationApi.reducerPath]: notificationApi.reducer,
   [areaApi.reducerPath]: areaApi.reducer
})

export default rootReducer
