import axios from "axios";


const baseurl = 'https://restcountries.com/v3.1/all'

const getall = async () => {
    const response = await axios.get(baseurl)
    return response.data
}

export default { getall }