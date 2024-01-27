import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './root.reducer'
import { authApi } from './apis/auth.api'
import { eventApi } from './apis/event.api'
import { userApi } from './apis/user.api'
import { statisticApi } from './apis/statistics.api'
import { feedbackApi } from './apis/feedback.api'
import { attendanceApi } from './apis/attendance.api'
import { notificationApi } from './apis/notification.api'
import { areaApi } from './apis/area.api'

const persistConfig = {
   key: 'root',
   storage,
   whitelist: ['auth']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
         }
      }).concat([
         authApi.middleware,
         eventApi.middleware,
         userApi.middleware,
         attendanceApi.middleware,
         statisticApi.middleware,
         feedbackApi.middleware,
         notificationApi.middleware,
         areaApi.middleware
      ])
} as ConfigureStoreOptions)

const persistor = persistStore(store)

export { persistor, store }
