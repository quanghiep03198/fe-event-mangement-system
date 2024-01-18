import { useReducer } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

export enum PaginationActions {
   GO_TO_PAGE = 'GO_TO_PAGE',
   GO_TO_NEXT_PAGE = 'GO_TO_NEXT_PAGE',
   GO_TO_PREV_PAGE = 'GO_TO_PREV_PAGE',
   GO_TO_FIRST_PAGE = 'GO_TO_FIRST_PAGE',
   GO_TO_LAST_PAGE = 'GO_TO_LAST_PAGE',
   CHANGE_PAGE_SIZE = 'CHANGE_PAGE_SIZE'
}

export type PaginationActionType = {
   type: PaginationActions
   payload?: number
}

export type PaginationHandler = React.Dispatch<PaginationActionType>

const intialState: PaginationPayload = {
   page: 1,
   limit: 10
}

const reducer = (state: any, action: PaginationActionType) => {
   switch (action.type) {
      case PaginationActions.GO_TO_PAGE:
         return { ...state, page: action.payload }
      case PaginationActions.GO_TO_NEXT_PAGE:
         return { ...state, page: state.page + 1 }
      case PaginationActions.GO_TO_PREV_PAGE:
         return { ...state, page: state.page - 1 }
      case PaginationActions.GO_TO_FIRST_PAGE:
         return { ...state, page: 1 }
      case PaginationActions.GO_TO_LAST_PAGE:
         return { ...state, page: action.payload }
      case PaginationActions.CHANGE_PAGE_SIZE:
         return { ...state, limit: action.payload }
   }
}

export default function useServerPagination(): [PaginationPayload, PaginationHandler] {
   const location = useLocation()
   const [params] = useSearchParams(location.search)

   const page = params.get('page')
   const limit = params.get('limit')

   const initialState: PaginationPayload = {
      page: page ? Number(params.get('page')) : 1,
      limit: limit ? Number(params.get('limit')) : 10
   }

   const [paginationState, dispatch] = useReducer(reducer, initialState)
   const state = paginationState ?? intialState
   return [state, dispatch]
}
