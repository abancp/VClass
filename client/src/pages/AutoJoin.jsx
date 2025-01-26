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
      if (status === 401) {
        navigate('/login?for=join?name=' + params.get('name') + '&key=' + params.get('key'))
      } else if (status === 409) {
        toast.info("User already joined this class!")
        navigate("/class/" + data.classid)
      } else if (status === 404) {
        toast.error("class not existing or the link is expired!")
        navigate("/")
      } else if (status === 400 && data.success) {
        toast.success("Joined to class :" + params.get("name"))
        navigate('/class/' + data.classid)
      } else {
        navigate("/")
      }
    })

  }, [navigate, params])
  return (
    <div>
      Joining... , Redirecting...
    </div>
  )
}

export default AutoJoin
