import axios from 'axios/index';

export const GET_PESERTA_DIDIK_DAPODIK = '[PESERTA DIDIK] GET_PESERTA_DIDIK_DAPODIK';
export const GET_CALON_PESERTA_DIDIK = '[PESERTA DIDIK] GET_CALON_PESERTA_DIDIK';
export const CEK_NIK = '[PESERTA DIDIK] CEK_NIK';
export const CEK_NISN = '[PESERTA DIDIK] CEK_NISN';
export const SIMPAN_CALON_PESERTA_DIDIK = '[PESERTA DIDIK] SIMPAN_CALON_PESERTA_DIDIK';
export const GEOCODE = '[APP] GEOCODE';
export const SET_JUDUL_KANAN = '[APP] SET JUDUL KANAN';
export const SET_ISI_KANAN = '[APP] SET ISI KANAN';
export const PANEL_KANAN_BUKA = '[APP] PANEL KANAN BUKA';
export const SIMPAN_LINTANG_BUJUR = '[APP] SIMPAN_LINTANG_BUJUR';
export const GET_JALUR = '[APP] GET_JALUR';
export const GET_SEKOLAH_PPDB = '[APP] GET_SEKOLAH_PPDB';
export const SIMPAN_SEKOLAH_PILIHAN = '[APP] SIMPAN_SEKOLAH_PILIHAN';
export const GET_SEKOLAH_PILIHAN = '[APP] GET_SEKOLAH_PILIHAN';
export const GET_JALUR_BERKAS = '[APP] GET_JALUR_BERKAS';
export const SIMPAN_BERKAS_CALON = '[APP] SIMPAN_BERKAS_CALON';
export const SIMPAN_KONFIRMASI = '[APP] SIMPAN_KONFIRMASI';
export const GET_JADWAL = '[APP] GET_JADWAL';
export const GET_STATISTIK_SEKOLAH = '[APP] GET_STATISTIK_SEKOLAH';

export function getCalonPesertaDidik(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getCalonPesertaDidik', {
        ...routeParams,
        tipe: 'belum_dibaca'
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_CALON_PESERTA_DIDIK,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesertaDidikDapodik(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getPesertaDidikDapodik', {
        ...routeParams,
        tipe: 'belum_dibaca'
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_DAPODIK,
                payload: response.data,
                routeParams
            })
        );
}

export function cekNik(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/cekNik', {
        // params: {
            ...routeParams
        // }
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : CEK_NIK,
                payload: response.data,
                routeParams
            })
        );
}

export function cekNISN(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/cekNISN', {
        // params: {
            ...routeParams
        // }
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : CEK_NISN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanCalonPesertaDidik(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/simpanCalonPesertaDidik', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_CALON_PESERTA_DIDIK,
                payload: response.data,
                routeParams
            })
        );
}


export function getGeocode(routeParams)
{
    const request = axios.get('https://nominatim.openstreetmap.org/search.php?q='+routeParams.keyword+'&format=json');

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GEOCODE,
                payload: response.data,
                routeParams
            })
        );
}

export function setJudulKanan(string)
{
    
    return (dispatch) => {
        return dispatch ({
            type: SET_JUDUL_KANAN,
            judul_panel_kanan: string
        })
    }
}

export function setIsiKanan(object)
{
    
    return (dispatch) => {
        return dispatch ({
            type: SET_ISI_KANAN,
            isi_panel_kanan: object
        })
    }
}

export function panelKananBuka(boolean)
{
    
    return (dispatch) => {
        return dispatch ({
            type: PANEL_KANAN_BUKA,
            panel_kanan_buka: boolean
        })
    }
}

export function simpanLintangBujur(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/simpanLintangBujur', {
        ...routeParams
        // params: {
        //     ...routeParams
        // }
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_LINTANG_BUJUR,
                payload: response.data,
                routeParams
            })
        );
}

export function getJalurPPDB(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getJalur', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JALUR,
                payload: response.data,
                routeParams
            })
        );
}

export function getSekolahPPDB(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getSekolahPPDB', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SEKOLAH_PPDB,
                payload: response.data,
                routeParams
            })
        );
}


export function simpanSekolahPilihan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/simpanSekolahPilihan', {
        ...routeParams
        // params: {
        //     ...routeParams
        // }
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_SEKOLAH_PILIHAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getSekolahPilihan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getSekolahPilihan', {
        ...routeParams
        // params: {
        //     ...routeParams
        // }
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SEKOLAH_PILIHAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getJalurBerkas(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getJalurBerkas', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JALUR_BERKAS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanBerkasCalon(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/simpanBerkasCalon', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_BERKAS_CALON,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKonfirmasi(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/simpanKonfirmasi', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KONFIRMASI,
                payload: response.data,
                routeParams
            })
        );
}

export function getJadwal(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getJadwal', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JADWAL,
                payload: response.data,
                routeParams
            })
        );
}

export function getStatistikSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PPDB/getStatistikSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JADWAL,
                payload: response.data,
                routeParams
            })
        );
}
