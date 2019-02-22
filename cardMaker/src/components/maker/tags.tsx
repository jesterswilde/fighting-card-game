import * as React from 'react';

// interface TagObj{
//     value: string,
//     uuid?: number
// }

// interface Props {
//     addTag: () => void,
//     removeTag: (index: number) => void,
//     updateTag: (value: TagObj, index: number) => void
//     tags: TagObj[]
// }

// export default ({ addTag, removeTag, updateTag, tags }: Props) => {
//     return <div className='mb-3'>
//         <h2>Tags <button className="btn btn-sm btn-primary" onClick={addTag}> + </button></h2>
//         {tags.map((tag, i) => {
//             return <div key={getUUID(tag)} className="mb-1">
//                 <span className="col-1"><button className="btn btn-danger btn-sm" onClick={() => removeTag(i)}> - </button></span>
//                 <input type="text" value={tag.value} onChange={(e)=>{
//                     updateTag({...tag, value: e.target.value}, i); 
//                 }}/>
//             </div>
//         })}
//     </div>
// }