import { UserInterface } from '@/common/types/entities'
import generatePicture from '@/common/utils/generate-picture'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import * as _ from 'lodash'
import { authApi } from '../apis/auth.api'

type AuthSliceState = {
   user: Omit<UserInterface, 'password'> | null
   authenticated: boolean
}
type SigninResponseData = SuccessResponse<{ user: Omit<UserInterface, 'password'>; access_token: string }>

/**
 * Async thunk actions
 */
export const signinWithGoogle = createAsyncThunk<SigninResponseData, string>('auth/google', async (oauth2Token: string, { rejectWithValue, signal }) => {
   try {
      const BASE_URL = import.meta.env.VITE_API_URL
      const response = await axios.get(BASE_URL + '/auth/google', { headers: { Authorization: oauth2Token }, signal })
      return response.data
   } catch (error) {
      rejectWithValue(null)
   }
})

const initialState: AuthSliceState = { user: null, authenticated: false }

const authStateFields = ['id', 'email', 'name', 'phone', 'role', 'avatar'] as const

export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      signout: () => initialState
   },
   extraReducers: (build) => {
      build.addCase(signinWithGoogle.fulfilled, (_state, action: PayloadAction<Record<string, any>>) => {
         const payload = _.pick(action.payload?.metadata?.user, authStateFields) as Omit<UserInterface, 'password'>
         return { user: payload, authenticated: true }
      })
      build.addMatcher(authApi.endpoints.signin.matchFulfilled, (_state: AuthSliceState, action: PayloadAction<SigninResponseData>) => {
         const payload = _.pick(action.payload?.metadata?.user, authStateFields) as Omit<UserInterface, 'password'>
         return {
            user: { ...payload, avatar: !payload.avatar ? generatePicture(payload?.name) : payload.avatar },
            authenticated: true
         }
      })
      build.addMatcher(authApi.endpoints.updateUserInfo.matchFulfilled, (_state: AuthSliceState, action: PayloadAction<Partial<UserInterface>>) => {
         const payload = _.pick(action.payload, authStateFields) as Omit<UserInterface, 'password'>
         return {
            user: { ...payload, avatar: !payload.avatar ? generatePicture(payload?.name) : payload.avatar },
            authenticated: true
         }
      })
   }
})

/**
 * Redux actions
 */
export const { signout } = authSlice.actions
