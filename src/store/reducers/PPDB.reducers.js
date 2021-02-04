import * as Actions from '../actions';

const initialState = {
    cek_nik: {
        rows: [],
        total: 0
    },
    cek_nisn: {
        rows: [],
        total: 0
    },
    calon_peserta_didik: {
        rows: [],
        total: 0
    },
    jalur: {
        rows: [],
        total: 0
    },
    jenis_prestasi: {
        rows: [],
        total: 0
    },
    tingkat_prestasi: {
        rows: [],
        total: 0
    },
    nilai_prestasi: {
        rows: [],
        total: 0
    },
    geocode: [],
    judul_panel_kanan: 'Judulnya kanan',
    panel_kanan_buka: false,
};

const PPDBReducers = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.CEK_NIK:
        {
            return {
                ...state,
                cek_nik: action.payload
            };
        }
        case Actions.CEK_NISN:
        {
            return {
                ...state,
                cek_nisn: action.payload
            };
        }
        case Actions.GET_CALON_PESERTA_DIDIK:
        {
            return {
                ...state,
                calon_peserta_didik: action.payload
            };
        }
        case Actions.GEOCODE:
        {
            return {
                ...state,
                geocode: action.payload
            };
        }
        case Actions.SET_JUDUL_KANAN:
        {
            return {
                ...state,
                judul_panel_kanan: action.judul_panel_kanan
            };
        }
        case Actions.SET_ISI_KANAN:
        {
            return {
                ...state,
                isi_panel_kanan: action.isi_panel_kanan
            };
        }
        case Actions.GET_JALUR:
        {
            return {
                ...state,
                jalur: action.payload
            };
        }
        case Actions.GET_JENIS_PRESTASI:
        {
            return {
                ...state,
                jenis_prestasi: action.payload
            };
        }
        case Actions.GET_TINGKAT_PRESTASI:
        {
            return {
                ...state,
                tingkat_prestasi: action.payload
            };
        }
        case Actions.PANEL_KANAN_BUKA:
        {
            return {
                ...state,
                panel_kanan_buka: action.panel_kanan_buka
            };
        }
        case Actions.GET_NILAI_PRESTASI:
        {
            return {
                ...state,
                nilai_prestasi: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default PPDBReducers;