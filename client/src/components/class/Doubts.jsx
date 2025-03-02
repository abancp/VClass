import axios from 'axios'
import { document } from 'postcss'
import React, { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { toast } from 'sonner'
import { SERVER_URL } from '../../config/SERVER_URL'

function Doubts({ id, role }) {

  const [doubt, setDoubt] = useState("")
  const [doubts, setDoubts] = useState([])

  useEffect(() => {
    axios.get(SERVER_URL + "/doubt/" + id + "?skip=0", { withCredentials: true })
      .then(({ data }) => {
        console.log(data)
        setDoubts(data.doubts)
      })
  }, [id])

  const handleAskDoubt = (e) => {
    e.preventDefault()
    if (!doubt) return
    axios.post(SERVER_URL + "/doubt/" + id, { doubt }, { withCredentials: true })
      .then(() => {
        setDoubt("")
        toast.success("Doubt Posted!")
      })
  }

  const likeDoubt = (doubt_id, user_reaction, i) => {
    axios.post(SERVER_URL + "/doubt/like/" + id + "/" + doubt_id, {}, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log("liked!")
          if (user_reaction === "like") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? { ...d, likes: d.likes - 1, user_reaction: null } : d
            )))
          } else if (user_reaction === "dislike") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? { ...d, likes: d.likes + 1, dislikes: d.dislikes - 1, user_reaction: "like" } : d
            )))
          } else {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? { ...d, likes: d.likes + 1, user_reaction: "like" } : d
            )))
          }

        } else {
          toast.error(data.message || "something went wrong")
        }
      })
      .catch((error) => {
        console.log(error)
        toast.error(error?.response?.data?.message || "something went wrong")
      })
  }

  const dislikeDoubt = (doubt_id, user_reaction, i) => {
    axios.post(SERVER_URL + "/doubt/dislike/" + id + "/" + doubt_id, {}, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log("disliked!")
          if (user_reaction === "dislike") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? { ...d, dislikes: d.dislikes - 1, user_reaction: null } : d
            )))
          } else if (user_reaction === "like") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? { ...d, dislikes: d.dislikes + 1, likes: d.likes - 1, user_reaction: "dislike" } : d
            )))
          } else {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? { ...d, dislikes: d.dislikes + 1, user_reaction: "dislike" } : d
            )))
          }
        } else {
          toast.error(data.message || "something went wrong")
        }
      })
      .catch((error) => {
        console.log(error)
        toast.error(error?.response?.data?.message || "something went wrong")
      })
  }

  const handleViewComments = (d, i) => {
    setDoubts((p) => p.map((q0, i0) => i0 === i ? {
      ...q0, view_comments: !d.view_comments
    } : q0))
    if (d.comments) return
    axios.get(SERVER_URL + "/doubt/comment/" + id + "/" + doubts[i]?._id.$oid, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setDoubts((p) => p.map((q0, i0) => i0 === i ? {
            ...q0, comments: data.comments
          } : q0))
        } else {
          toast.error(data.message || "something went wrong!")
        }
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message || "something went wrong!")
      })
  }

  const handleComment = (e, i) => {
    e.preventDefault()
    axios.post(SERVER_URL + "/doubt/comment/" + id + "/" + doubts[i]?._id?.$oid, { comment: e.target["comment-" + i]?.value }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log("commented!")
        }
      })
  }

  const likeComment = (comment_id, user_reaction, i, ci) => {
    axios.post(SERVER_URL + "/doubt/comment/like/" + id + "/" + comment_id, {}, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log("liked!")
          if (user_reaction === "like") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? {
                ...d, comments: d.comments?.map((c0, ci0) =>
                  ci === ci0 ? { ...c0, likes: c0.likes - 1, user_reaction: null } : c0
                )
              } : d
            )))
          } else if (user_reaction === "dislike") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? {
                ...d, comments: d.comments?.map((c0, ci0) =>
                  ci === ci0 ? { ...c0, likes: c0.likes + 1, dislikes: c0.dislikes - 1, user_reaction: "like" } : c0
                )
              } : d
            )))
          } else {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? {
                ...d, comments: d.comments?.map((c0, ci0) =>
                  ci === ci0 ? { ...c0, likes: c0.likes + 1, user_reaction: "like" } : c0
                )
              } : d
            )))
          }

        } else {
          toast.error(data.message || "something went wrong")
        }
      })
      .catch((error) => {
        console.log(error)
        toast.error(error?.response?.data?.message || "something went wrong")
      })
  }

  const dislikeComment = (comment_id, user_reaction, i, ci) => {
    axios.post(SERVER_URL + "/doubt/comment/dislike/" + id + "/" + comment_id, {}, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log("disliked!")
          if (user_reaction === "dislike") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? {
                ...d, comments: d.comments?.map((c0, ci0) =>
                  ci === ci0 ? { ...c0, dislikes: c0.dislikes - 1, user_reaction: null } : c0
                )
              } : d
            )))

          } else if (user_reaction === "like") {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? {
                ...d, comments: d.comments?.map((c0, ci0) =>
                  ci === ci0 ? { ...c0, dislikes: c0.dislikes + 1, likes: c0.likes - 1, user_reaction: "dislike" } : c0
                )
              } : d
            )))

          } else {
            setDoubts((p) => (p.map((d, j) =>
              i === j ? {
                ...d, comments: d.comments?.map((c0, ci0) =>
                  ci === ci0 ? { ...c0, dislikes: c0.dislikes + 1, user_reaction: "dislike" } : c0
                )
              } : d
            )))
          }
        } else {
          toast.error(data.message || "something went wrong")
        }
      })
      .catch((error) => {
        console.log(error)
        toast.error(error?.response?.data?.message || "something went wrong")
      })
  }

  return (
    <div className='w-full pt-header items-center justify-end  p-3 h-[calc(100vh-3.5rem)] '>
      <Scrollbars className='flex flex-col gap-3 '>
        {role === 'student' &&
          <form onSubmit={handleAskDoubt} className='flex mb-3 flex-col gap-3'>
            <textarea onChange={(e) => setDoubt(e.target.value)} value={doubt} id="doubt" name='doubt' className='w-full bg-dark border border-tersiory/30 p-2 rounded-md focus:outline-none min-h-[5rem]'></textarea>
            <div className='w-full flex justify-end '>
              <button type='submit' className={`px-2 py-1 ${doubt || "opacity-50"} focus:outline-none bg-tersiory rounded-md font-semibold`}>Ask Doubt</button>

            </div>
          </form>
        }
        <div className='rounded-2xl flex flex-col gap-3'>
          {
            doubts.map((d, i) => (
              <div>
                <div className='bg-secondery/70 p-2 flex flex-col gap-3 rounded-2xl'>
                  <div className='flex justify-start items-center gap-2'>
                    <img referrerPolicy='no-referrer' src={d.profile_url} alt="profile" className='w-[1.7rem]  rounded-full' />
                    <h4 className='text-lg font-semibold'>{d.username}</h4>
                  </div>
                  {d.doubt}
                  <div className='flex gap-3 items-center'>
                    <div className='flex  items-center'>
                      <svg onClick={() => likeDoubt(d._id.$oid, d.user_reaction, i)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-hand-thumbs-up hover:text-tersiory cursor-pointer p-[3px] rounded-full hover:bg-secondery/80" viewBox="0 0 16 16">
                        {
                          d.user_reaction === "like" ?
                            <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                            :
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />}
                      </svg>
                      <h5>{d.likes}</h5>
                    </div>
                    <div className='flex items-center '>
                      <svg onClick={() => dislikeDoubt(d._id.$oid, d.user_reaction, i)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-hand-thumbs-up hover:text-tersiory cursor-pointer p-[3px] rounded-full hover:bg-secondery/80" viewBox="0 0 16 16">
                        {d.user_reaction === "dislike" ?
                          <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591" />

                          :
                          <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1" />
                        }
                      </svg>

                      <h5>{d.dislikes}</h5>
                    </div>
                    <div className='flex gap-1 items-center '>
                      <svg onClick={() => handleViewComments(d, i)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-chat-dots hover:text-tersiory cursor-pointer rounded-full p-[3px] hover:bg-secondery/80" viewBox="0 0 16 16">
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                      </svg>
                      <h5>10</h5>
                    </div>
                  </div>
                </div>
                {
                  d.view_comments &&
                  < div className='w-full h-full flex pl-[4rem]'>
                    <div>
                      <div className={`w-[3rem] h-[2.3rem] ${d.comments?.length === 0 && "rounded-bl-2xl"} border-l border-b border-tersiory`}></div>
                      {
                        d.comments?.length !== 0 &&
                        <div className={`w-[3rem] h-full ${d.comments?.length === 1 && "rounded-bl-2xl"} border-l border-tersiory`}></div>
                      }
                    </div>
                    <form onSubmit={(e) => handleComment(e, i)} className='mt-3 h-full border-tersiory border w-full rounded-2xl'>
                      <textarea name={"comment-" + i} className='w-full  focus:outline-none rounded-2xl p-2 bg-dark'>
                      </textarea>
                      <div className='w-full flex justify-end'>
                        <button type='submit' className={`px-2 mb-2 mr-2 py-1 focus:outline-none bg-tersiory rounded-md font-semibold`}>Comment</button>
                      </div>
                    </form>
                  </div>

                }
                {
                  d.view_comments && d.comments?.map((c, ci) => (
                    < div className='w-full h-full flex pl-[4rem]'>
                      <div>

                        <div className={`w-[3rem] h-[2.3rem] ${ci === d.comments?.length - 1 && "rounded-bl-2xl border-b"} border-l  border-tersiory`}></div>
                        {
                          ci < d.comments?.length - 1 &&
                          <div className={`w-[3rem] h-full ${ci === d.comments?.length - 2 && "rounded-bl-2xl"} border-t border-l border-tersiory`}></div>
                        }
                      </div>
                      <div className='w-full'>
                        <div className='bg-secondery/70 mt-3 p-2 w-full flex flex-col gap-3 rounded-2xl'>
                          <div className='flex justify-start items-center gap-2'>
                            <img referrerPolicy='no-referrer' src={c.profile_url} alt="profile" className='w-[1.7rem]  rounded-full' />
                            <h4 className='text-lg font-semibold'>{c.username}</h4>
                          </div>
                          {c.comment}
                          <div className='flex gap-3 items-center'>
                            <div className='flex  items-center'>
                              <svg onClick={() => likeComment(c._id.$oid, c.user_reaction, i, ci)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-hand-thumbs-up hover:text-tersiory cursor-pointer p-[3px] rounded-full hover:bg-secondery/80" viewBox="0 0 16 16">
                                {
                                  c.user_reaction === "like" ?
                                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                                    :
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />}
                              </svg>
                              <h5>{c.likes}</h5>
                            </div>
                            <div className='flex items-center '>
                              <svg onClick={() => dislikeComment(c._id.$oid, c.user_reaction, i, ci)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-hand-thumbs-up hover:text-tersiory cursor-pointer p-[3px] rounded-full hover:bg-secondery/80" viewBox="0 0 16 16">
                                {c.user_reaction === "dislike" ?
                                  <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.38 1.38 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51q.205.03.443.051c.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.9 1.9 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2 2 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.2 3.2 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.8 4.8 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591" />

                                  :
                                  <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1" />
                                }
                              </svg>

                              <h5>{c.dislikes}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </Scrollbars >
    </div >

  )
}

export default Doubts
