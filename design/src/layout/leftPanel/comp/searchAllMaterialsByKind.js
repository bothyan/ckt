/**
 * Created by suti on 2017/7/26.
 */
import axios from 'axios'

export function searchAllMaterialsByKind({firstKindId,secondKindId,pageNo,pageSize}) {
	return axios.post('/material/searchAllMaterialsByKind',{firstKindId,secondKindId,pageNo,pageSize})
}
