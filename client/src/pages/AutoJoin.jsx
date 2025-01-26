import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
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
    ).then(({ data,status }) => {
      if (status === 401) {
        navigate('/login?for=join?name='+params.get('name')+'&key='+params.get('key'))
      }
      if (data.success) {
        navigate('/class/' + data.classid)
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
