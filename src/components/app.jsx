import React, {Component} from 'react';
import {
  App,
  Panel,
  Views,
  View,
  Statusbar,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  List,
  ListItem} from 'framework7-react';
import LoginPage from '../pages/login';
// import {Provider} from 'react-redux';
// import store from 'store';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

import cordovaApp from '../js/cordova-app';
import routes from '../js/routes';

import io from 'socket.io-client';

import 'framework7-icons';

class app extends Component {
  state = {
    // Framework7 Parameters
    f7params: {
      id: 'io.timkayu.diskuis', // App bundle ID
      name: 'Diskuis', // App name
      theme: 'ios', // Automatic theme detection
      // App root data
      data: function () {
        return {
          user: {
            firstName: 'Khalid',
            lastName: 'Saifuddin',
          },

        };
      },

      // App routes
      routes: routes,
      // Enable panel left visibility breakpoint
      panel: {
        leftBreakpoint: 960,
      },

      // Register service worker
      serviceWorker: this.$device.cordova ? {} : {
        path: '/service-worker.js',
      },
      // Input settings
      input: {
        scrollIntoViewOnFocus: this.$device.cordova && !this.$device.electron,
        scrollIntoViewCentered: this.$device.cordova && !this.$device.electron,
      },
      // Cordova Statusbar settings
      statusbar: {
        overlay: this.$device.cordova && this.$device.ios || 'auto',
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
      },
    },
    tabBar:{
      beranda: true,
      kategori: false,
      cari: false,
      materi: false,
      profil: false
    },
    // Login screen demo data
    username: '',
    password: '',
  };

    // this.onClickLinkTab = this.onClickLinkTab.bind(this);
    // this.onClickMenu = this.onClickMenu.bind(this);
  
  onClickLinkTab = (menu) => {
    // console.log(event);
    
    for (var property in this.props.tabBar) {
      // console.log(this.state.tabBar[property]);
      this.props.tabBar[property] = false;
    }
    
    this.props.tabBar[menu] = true;
    
    // console.log(this.props.tabBar);

    this.props.setTabActive(this.props.tabBar);
    // console.log(this.props.tabBar);

    // this.setState({
    //   ...this.state,
    //   tabBar: this.props.tabBar
    // });
  }

  onClickMenu(){
    console.log(this.props);
    // alert(menu);
  }

  componentDidMount = () => {
    // console.log(this);
    // console.log(this);
    // this.$f7route.navigate(localStorage.getItem('initial_route'));

    // let socket = io(localStorage.getItem('socket_url'));
    // let params = {};

    // // console.log(localStorage.getItem('device'));
    // // console.log(parseInt(localStorage.getItem('sudah_login')));

    // // if(parseInt(localStorage.getItem('sudah_login')) === 1){
    // //   console.log(this.$f7router);
    // // }

    // // console.log(params);
    // socket.emit('online', params, function (err) {
    //   if (err) {
    //       this.props.history.push('/');
    //   }
    // });
    
  }

  gantiSemester = (b) => {
    localStorage.setItem('semester_id_aplikasi', b.target.value);
    console.log(localStorage.getItem('semester_id_aplikasi'));
  }

  keluar = () =>{
    // this.$f7.dialog.alert('oke');
    localStorage.setItem('sudah_login', '0');
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    localStorage.setItem('sekolah_id_beranda', '');
    localStorage.setItem('custom_logo_sekolah', '');
    // localStorage.setItem('google_api', null);

    // window.location.href="/";
    if(localStorage.getItem('device') === 'android'){
        window.location.reload(true);
    }else{
        window.location.href="/";
    }
  }

  render() {
    // console.log(this.props.tabBar.beranda);
    // const {classes} = this.props;
    
    // console.log(classes);

    return (
      <App params={ this.state.f7params } hideToolbarOnScroll>
      {/* <Provider store={store}> */}
        {/* Status bar overlay for fullscreen mode*/}
        <Statusbar></Statusbar>

        {/* Left panel with cover effect when hidden */}
        {parseInt(localStorage.getItem('sudah_login')) === 1 && localStorage.getItem('kode_aplikasi') !== 'MEJA-PPDB' &&
        <Panel left cover>
        {/* <Panel left cover themeDark> */}
          <View>
            <Page>
              {localStorage.getItem('custom_logo_sekolah') === null &&
              <div className="navbarLogoUtama">
                <img src={localStorage.getItem('api_base')+'/assets/berkas/diskuis_red.png'}  style={{height:'50px', margin:'auto', marginTop:'10px'}} />
              </div>
              }
              {localStorage.getItem('custom_logo_sekolah') === '' &&
              <div className="navbarLogoUtama">
                <img src={localStorage.getItem('api_base')+'/assets/berkas/diskuis_red.png'}  style={{height:'50px', margin:'auto', marginTop:'10px'}} />
              </div>
              }
              {localStorage.getItem('custom_logo_sekolah') !== '' && localStorage.getItem('custom_logo_sekolah') !== null &&
              <>
              <div className="navbarLogoUtama" style={{display:'inline-flex', marginLeft:'10%'}}>
                <img src={localStorage.getItem('api_base')+localStorage.getItem('custom_logo_sekolah')}  style={{height:'40px', margin:'auto', marginTop:'10px'}} />
                &nbsp;<span style={{textAlign:'left', marginTop:'10px', fontSize:'15px', fontWeight:'bold', marginLeft:'8px'}}>{localStorage.getItem('custom_logo_sekolah_nama')}</span>
              </div>
              <div style={{marginTop:'15px', fontSize:'10px', fontWeight:'bold', marginLeft:'8px', display:'inline-flex', paddingLeft:'20%', marginTop:'-10px'}}>
                <span style={{marginTop:'12px', marginRight:'8px'}}>powered by</span>
                <img src={localStorage.getItem('api_base')+'/assets/berkas/diskuis_red.png'}  style={{height:'15px', margin:'auto', marginTop:'10px'}} />
              </div>
              </>
              }
              <div style={{textAlign:'center', fontSize:'11px'}}>
                versi {localStorage.getItem('versi')}
              </div>
              {/* <Navbar className="navbarLogoUtama"> */}
              {/* </Navbar> */}
              {/* <Navbar title={localStorage.getItem('judul_aplikasi')}/> */}
              {localStorage.getItem('sekolah_id_beranda') !== '' && localStorage.getItem('sekolah_id_beranda') !== null &&
              <>
              <BlockTitle>Menu Sekolah</BlockTitle>
              <List noHairlinesBetween className="menuUtama">
                <ListItem noChevron link="/" view=".view-main" panelClose panel-close title="Beranda">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">rocket</i>
                </ListItem>
                <ListItem noChevron link={"/daftarGuru/"+localStorage.getItem('sekolah_id_beranda')} view=".view-main" panelClose panel-close title="Daftar Guru">
                  <i slot="media" className="f7-icons">person</i>
                </ListItem>
                <ListItem noChevron link={"/daftarSiswa/"+localStorage.getItem('sekolah_id_beranda')} view=".view-main" panelClose panel-close title="Daftar Siswa">
                  <i slot="media" className="f7-icons">person_3_fill</i>
                </ListItem>
                <ListItem noChevron link={"/kehadiranRekapGuru/"+localStorage.getItem('sekolah_id_beranda')} view=".view-main" panelClose panel-close title="Kehadiran Guru">
                  <i slot="media" className="f7-icons">person_crop_circle_badge_checkmark</i>
                </ListItem>
                <ListItem noChevron link={"/kehadiranRekapSiswa/"+localStorage.getItem('sekolah_id_beranda')} view=".view-main" panelClose panel-close title="Kehadiran Siswa">
                  <i slot="media" className="f7-icons">rectangle_badge_checkmark</i>
                </ListItem>
                <ListItem noChevron link={"/pengaturanPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+localStorage.getItem('sekolah_id_beranda')} view=".view-main" panelClose panel-close title="Pengaturan">
                  <i slot="media" className="f7-icons">gear_alt_fill</i>
                </ListItem>
              </List>
              </>
              }

              {/* {localStorage.getItem('sekolah_id_beranda') !== '' && localStorage.getItem('sekolah_id_beranda') !== null && */}
              {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
              <BlockTitle>Menu Pembelajaran</BlockTitle>
              }
              {/* } */}
              {/* {localStorage.getItem('sekolah_id_beranda') === '' && localStorage.getItem('sekolah_id_beranda') === null &&
              <BlockTitle>Menu Guru</BlockTitle>
              } */}
              {localStorage.getItem('kode_aplikasi') !== 'MEJA-EMPU' &&
              <List noHairlinesBetween className="menuUtama">
                {/* <ListItem link="/Cari" view=".view-main" panelClose panel-close title="Cari">
                  <i slot="media" className="f7-icons">search</i>
                </ListItem> */}
                {/* murid */}
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && (localStorage.getItem('sekolah_id_beranda') === '' || localStorage.getItem('sekolah_id_beranda') === null) &&
                <ListItem noChevron link="/" view=".view-main" panelClose panel-close title="Beranda">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">rocket</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link={"/cari/"} view=".view-main" panelClose panel-close title="Cari">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">search</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && 
                <ListItem noChevron link={"/kategori/"} view=".view-main" panelClose panel-close title="Kategori">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">doc_append</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                <ListItem noChevron link={"/Kuis/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} view=".view-main" panelClose panel-close title="Kuis">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">gamecontroller_alt_fill</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                <ListItem noChevron link={"/KuisFavorit/"} view=".view-main" panelClose panel-close title="Kuis Tersimpan">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">heart_fill</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                <ListItem noChevron link={"/Playlist/"} view=".view-main" panelClose panel-close title="Playlist Kuis">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">list_number</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                <ListItem noChevron link="/Ruang" view=".view-main" panelClose panel-close title="Ruang">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">circle_grid_hex_fill</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                <ListItem noChevron link={"/KuisAnda/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} view=".view-main" panelClose panel-close title="Kuis Anda">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">gamecontroller_alt_fill</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                <ListItem noChevron link="/RuangAnda" view=".view-main" panelClose panel-close title="Ruang Anda">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">circle_grid_hex_fill</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                <ListItem noChevron link={"/pertanyaanPengguna/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} view=".view-main" panelClose panel-close title="Diskusi & Materi">
                  <i slot="media" className="f7-icons">question_square_fill</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' && (localStorage.getItem('sekolah_id_beranda') === '' || localStorage.getItem('sekolah_id_beranda') === null) &&
                <ListItem noChevron link="/BerandaSekolah/" view=".view-main" panelClose panel-close title="Kelola Sekolah">
                  <i slot="media" className="f7-icons">building_2_fill</i>
                </ListItem>
                }
                {/* {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem link={"/pantauan/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} view=".view-main" panelClose panel-close title="Pantauan Pertanyaan">
                  <i slot="media" className="f7-icons">bell_circle_fill</i>
                </ListItem>
                } */}

                {/* guru */}
              </List>
              }
              {localStorage.getItem('kode_aplikasi') === 'MEJA-EMPU' &&
              <List noHairlinesBetween className="menuUtama">
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link="/" view=".view-main" panelClose panel-close title="Beranda">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">rocket</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link={"/kelola-blog/"} view=".view-main" panelClose panel-close title="Kelola Blog">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">quote_bubble_fill</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link="/EmpuKuis/kuis" view=".view-main" panelClose panel-close title="Kuis">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">chart_bar_square</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link="/EmpuKuis/ruang" view=".view-main" panelClose panel-close title="Ruang">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">chart_bar_square</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link="/EmpuKuis/pengguna" view=".view-main" panelClose panel-close title="Pengguna">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">chart_bar_square</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link="/EmpuKuis/pengguna_kuis" view=".view-main" panelClose panel-close title="Peserta Kuis">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">chart_bar_square</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') &&
                <ListItem noChevron link="/EmpuKuis/sekolah" view=".view-main" panelClose panel-close title="Sekolah">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">chart_bar_square</i>
                </ListItem>
                }
                {/* {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && 
                <ListItem noChevron link={"/cari/"} view=".view-main" panelClose panel-close title="Cari">
                  <i slot="media" className="f7-icons">search</i>
                </ListItem>
                } */}
              </List>
              }
              {localStorage.getItem('sudah_login') === '0' && 
              <List>
                  <ListItem link="/login" view=".view-main" panelClose panel-close title="Login/Masuk">
                    <i slot="media" className="f7-icons">square_arrow_right</i>
                  </ListItem>
              </List>
              }
              {/* <BlockTitle>Sekolah</BlockTitle>
              {localStorage.getItem('sudah_login') === '1' && 
              <>
              <List>
                  <ListItem noChevron link="/BerandaSekolah/" view=".view-main" panelClose panel-close title="Sekolah">
                    <i slot="media" className="f7-icons">building_2_fill</i>
                  </ListItem>
              </List>
              </>
              } */}
              {localStorage.getItem('sudah_login') === '1' && 
              <>
              <List noHairlinesBetween className="menuUtama">
                  {/* <ListItem noChevron link="/Pricing" view=".view-main" panelClose panel-close title="Berlangganan">
                    <i slot="media" className="f7-icons">money_dollar_circle_fill</i>
                  </ListItem> */}
                  <ListItem noChevron link="/ProfilPengguna" view=".view-main" panelClose panel-close title="Profil Pengguna">
                    <i slot="media" className="f7-icons">person_crop_square_fill</i>
                  </ListItem>
                  <ListItem noChevron link="/Leaderboard" view=".view-main" panelClose panel-close title="Leaderboard">
                    <i slot="media" className="f7-icons">flame</i>
                  </ListItem>
                  {/* <ListItem noChevron link="/Notifikasi" view=".view-main" panelClose panel-close title="Notifikasi" badge="5"> */}
                  <ListItem noChevron link="/Notifikasi" view=".view-main" panelClose panel-close title="Notifikasi">
                    {this.props.notifikasi_belum_dibaca.total > 0 &&
                    <div slot="after" className="badgeNotif">{this.props.notifikasi_belum_dibaca.total}</div>
                    }
                    {this.props.notifikasi_belum_dibaca.total < 1 &&
                    <div slot="after" className="badgeNotifKosong">0</div>
                    }
                    <i slot="media" className="f7-icons">bell_fill</i>
                  </ListItem>
                  {/* <ListItem noChevron link="/pengaturanPengguna" view=".view-main" panelClose panel-close title="Pengaturan Pengguna">
                    <i slot="media" className="f7-icons">gear_alt_fill</i>
                  </ListItem> */}
                  <ListItem noChevron onClick={this.keluar} panelClose panel-close title="Keluar" style={{background:'#470128', color:'white', cursor: 'pointer'}}>
                    <i slot="media" className="f7-icons">square_arrow_left</i>
                  </ListItem>
              </List>
              </>
              }
            </Page>
          </View>
        </Panel>
        }


        {/* Right panel with reveal effect*/}
        <Panel right cover themeDark style={{width:'280px'}}>
            <View>
                <Page>
                    <Navbar title={this.props.judul_panel_kanan}/>
                    <Block style={{paddingLeft:'0px', paddingRight:'0px'}}>
                      {this.props.isi_panel_kanan}
                    </Block>
                </Page>
            </View>
        </Panel>


        {/* Your main view, should have "view-main" class */}
        {/* <View main className="safe-areas" url="/" /> */}

        {/* Views/Tabs container */}
        
        <Views tabs className="safe-areas" hideToolbarOnScroll>
          {/* Tabbar for switching views-tabs */}
          {localStorage.getItem('sudah_login') === '1' && localStorage.getItem('kode_aplikasi') !== 'MEJA-PPDB' &&
          <Toolbar labels bottom className="mobileTab" hideToolbarOnScroll>
            {localStorage.getItem('sudah_login') === '1' &&
            <>
            <Link 
              href="/" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:rocket" 
              iconAurora="f7:rocket" 
              iconMd="f7:rocket" 
              text="Beranda" 
              style={{fontSize:'12px'}} 
            />
            {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
            <Link 
              href="/Cari" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:search" 
              iconAurora="f7:search" 
              iconMd="f7:search" 
              text="Cari" 
              style={{fontSize:'12px'}} 
            />
            }
            {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
            <Link 
              href={"/Kuis/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:gamecontroller_alt_fill" 
              iconAurora="f7:gamecontroller_alt_fill" 
              iconMd="f7:gamecontroller_alt_fill" 
              text="Kuis" 
              style={{fontSize:'12px'}} 
            />
            }
            {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
            <Link 
              href="/Ruang" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:circle_grid_hex_fill" 
              iconAurora="f7:circle_grid_hex_fill" 
              iconMd="f7:circle_grid_hex_fill" 
              text="Ruang" 
              style={{fontSize:'12px'}} 
            />
            }

            {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
            <Link 
              href={"/KuisAnda/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:gamecontroller_alt_fill" 
              iconAurora="f7:gamecontroller_alt_fill" 
              iconMd="f7:gamecontroller_alt_fill" 
              text="Kuis Anda" 
              style={{fontSize:'12px'}} 
            />
            }
            {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
            <Link 
              href="/RuangAnda" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:circle_grid_hex_fill" 
              iconAurora="f7:circle_grid_hex_fill" 
              iconMd="f7:circle_grid_hex_fill" 
              text="Ruang Anda" 
              style={{fontSize:'12px'}} 
            />
            }
            {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
            <Link 
              href="/BerandaSekolah/" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:building_2_fill" 
              iconAurora="f7:building_2_fill" 
              iconMd="f7:building_2_fill" 
              text="Sekolah" 
              style={{fontSize:'12px'}} 
            />
            }
            </>
            }
            {localStorage.getItem('kode_aplikasi') !== 'SPM' &&
            <>
            {localStorage.getItem('sudah_login') === '1' &&
              <>
              {/* <Link 
                href={"/pertanyaanPengguna/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} 
                // onClick={()=>{this.onClickLinkTab('beranda')}} 
                // tabLinkActive={this.props.tabBar.beranda} 
                iconIos="f7:question_square_fill" 
                iconAurora="f7:question_square_fill" 
                iconMd="f7:question_square_fill" 
                text="Diskusi" 
                style={{fontSize:'12px'}} 
              /> */}
              {/* <Link 
                href={"/pantauan/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} 
                // onClick={()=>{this.onClickLinkTab('beranda')}} 
                // tabLinkActive={this.props.tabBar.beranda} 
                iconIos="f7:bell_circle" 
                iconAurora="f7:bell_circle" 
                iconMd="f7:bell_circle" 
                text="Pantau" 
                style={{fontSize:'12px'}} 
              /> */}
              {/* <Link 
                href="/ProfilPengguna" 
                // onClick={()=>{this.onClickLinkTab('beranda')}} 
                tabLinkActive={this.props.tabBar.beranda} 
                iconIos="f7:person_alt" 
                iconAurora="f7:person_alt" 
                iconMd="material:person_alt" 
                text="Pengguna" 
                style={{fontSize:'12px'}} 
              /> */}
              </>
            }
            {localStorage.getItem('sudah_login') === '0' &&
              <Link 
                href="/login" 
                // onClick={()=>{this.onClickLinkTab('beranda')}} 
                tabLinkActive={this.props.tabBar.beranda} 
                iconIos="f7:square_arrow_right" 
                iconAurora="f7:square_arrow_right" 
                iconMd="material:square_arrow_right" 
                text="Login" 
                style={{fontSize:'12px'}} 
              />
            }
            </>
            }
            {localStorage.getItem('kode_aplikasi') === 'MEJA-EMPU' &&
            <Link 
              href="/EmpuKuis/kuis" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:chart_bar_square" 
              iconAurora="f7:chart_bar_square" 
              iconMd="f7:chart_bar_square" 
              text="Kuis" 
              style={{fontSize:'12px'}} 
            />
            }
            {localStorage.getItem('kode_aplikasi') === 'MEJA-EMPU' &&
            <Link 
              href="/EmpuKuis/ruang" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:chart_bar_square" 
              iconAurora="f7:chart_bar_square" 
              iconMd="f7:chart_bar_square" 
              text="Ruang" 
              style={{fontSize:'12px'}} 
            />
            }
            {localStorage.getItem('kode_aplikasi') === 'MEJA-EMPU' &&
            <Link 
              href="/EmpuKuis/pengguna" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              // tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:chart_bar_square" 
              iconAurora="f7:chart_bar_square" 
              iconMd="f7:chart_bar_square" 
              text="Pengguna" 
              style={{fontSize:'12px'}} 
            />
            }
            <Link 
              iconIos="f7:ellipsis_vertical_circle" 
              iconAurora="f7:ellipsis_vertical_circle" 
              iconMd="material:ellipsis_vertical_circle" 
              text="More"
              panelOpen="left" 
              // loginScreenOpen="#my-login-screen" 
              style={{fontSize:'12px'}}
            />
            {/* <Link link="/" view=".view-main" tabLinkActive iconIos="f7:home_fil" iconAurora="f7:home_fil" iconMd="material:home" text="Home" />
            <Link link="/catalog/" view=".view-main" iconIos="f7:list_fill" iconAurora="f7:list_fill" iconMd="material:view_list" text="Catalog" />
            <Link link="/form/" view=".view-main" iconIos="f7:settings_fill" iconAurora="f7:settings_fill" iconMd="material:settings" text="About" /> */}
          </Toolbar>
          }

          {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
          <View id="view-beranda" main tab tabActive url="/" pushState={localStorage.getItem('device') === 'android' ? false : true} />

          {/* Catalog View */}
          {/* <View id="view-kategori" name="kategori" tab url="/kategori/" /> */}

          {/* Settings View */}
          {/* <View id="view-cari" name="cari" tab url="/cari/" /> */}

          {/* Settings View */}
          {/* <View id="view-settings" name="About" tab url="/settings/" /> */}

        </Views>

        {/* loading screen */}
        


        {/* Popup */}
        <Popup id="my-popup">
          <View>
            <Page>
              <Navbar title="Popup">
                <NavRight>
                  <Link popupClose>Close</Link>
                </NavRight>
              </Navbar>
              <Block>
                <p>Popup content goes here.</p>
              </Block>
            </Page>
          </View>
        </Popup>

        <LoginScreen id="my-login-screen">
          <LoginPage/>
          {/* <View>
            <Page loginScreen>
              <LoginScreenTitle>Masuk Aplikasi</LoginScreenTitle>
              <List form>
                <ListInput
                  type="text"
                  name="username"
                  placeholder="Your username"
                  value={this.state.username}
                  onInput={(e) => this.setState({username: e.target.value})}
                ></ListInput>
                <ListInput
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={this.state.password}
                  onInput={(e) => this.setState({password: e.target.value})}
                ></ListInput>
              </List>
              <List>
                <ListButton title="Sign In" loginScreenClose onClick={() => this.alertLoginData()} />
                <BlockFooter>
                  Some text about login information.<br />Click "Sign In" to close Login Screen
                </BlockFooter>
              </List>
            </Page>
          </View> */}
        </LoginScreen>
      {/* </Provider> */}
      </App>
    )
  }
  alertLoginData() {
    this.$f7.dialog.alert('Username: ' + this.state.username + '<br>Password: ' + this.state.password);
  }
  componentDidMount() {
    // console.log(this.props);
    // this.$f7.preloader.show();
    // this.$f7.dialog.preloader();
    setTimeout(() => {
      // this.$f7.preloader.hide();
      // this.$f7.dialog.close();

    }, 3000);

    this.$f7ready((f7) => {
      // Init cordova APIs (see cordova-app.js)
      if (f7.device.cordova) {
        cordovaApp.init(f7);
        
        // console.log(localStorage.getItem('device'));
        // console.log(parseInt(localStorage.getItem('sudah_login')));
      }
      // Call F7 APIs here
    });
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWindowDimension: Actions.updateWindowDimension,
    setLoading: Actions.setLoading,
    setTabActive: Actions.setTabActive,
    getNotifikasi: Actions.getNotifikasi
  }, dispatch);
}

function mapStateToProps({ App, Notifikasi }) {
  // console.log(App.tabBar);

  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      judul_panel_kanan: App.judul_panel_kanan,
      isi_panel_kanan: App.isi_panel_kanan,
      notifikasi_belum_dibaca: Notifikasi.notifikasi_belum_dibaca
  }
}

export default (connect(mapStateToProps, mapDispatchToProps)(app));