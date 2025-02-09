import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { SERVER_URL } from '../config/SERVER_URL'

function AutoJoin() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  useEffect(() => {
    axios.post(SERVER_URL + "/class/join",
      {
        name: params.get("name"),
        key: params.get("key")
      },
      { withCredentials: true }
    ).then(({ data, status }) => {
      console.log(status)
      if (data.success) {
        toast.success("Joined to class :" + params.get("name"))
        navigate('/class/' + data.classid)
      } else {
        navigate("/")
      }
    })
      .catch(({ response } ) => {
        if (response.status === 401) {
          console.log("/login?to=join&name="+params.get('name')+'&key='+params.get('key'))
          navigate("/login?to=join&name="+params.get('name')+'&key='+params.get('key'))
        } else if (response.status === 409) {
          toast.info("User already joined this class!")
          navigate("/class/" + response.data.classid)
        } else if (response.status === 404) {
          toast.error("class not existing or the link is expired!")
          navigate("/")
        }
      })

  }, [navigate, params])
  return (
    <div className='w-screen h-screen text-tersiory bg-dark'>
      Joining... , Redirecting...
    </div>
  )
}

export default AutoJoin
