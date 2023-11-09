<template>
  <div class="columns is-mobile is-multiline">
    <div class="mandatory column is-8">
      <h6 class="tag is-large is-light">VTBD - ARR ATIS</h6>
        <div class="time">
          <p class= "first-p" v-if="receivedData && receivedData.atisTime">TIME</p>
          <input type="text" :style="{ width: '8ch' }" :value="receivedData && receivedData.atisTime" readonly class="input is-small custom-margin" />
          <p v-if="receivedData && receivedData.metReportTime">MET AT</p>
          <input type="text" :style="{ width: '8ch' }" :value="receivedData && receivedData.metReportTime" readonly class="input is-small custom-margin" />
        </div>
        <div class="apch">
        <p class= "first-p" v-if="receivedData && receivedData.appType && receivedData.appType.toLowerCase() !== 'n/a'">APCH</p>
        <input type="text" :value="receivedData && receivedData.appType" readonly class="input is-small custom-margin" />
        </div>
        <div class="RWY">
        <p class= "first-p" v-if="receivedData && receivedData.atisRWY">RWY</p>
        <input type="text" :style="{ width: '7ch' }" :value="receivedData && receivedData.atisRWY" readonly class="input is-small custom-margin" />
        <button :class="getLeftButtonClass()">{{ getLeftButtonLabel() }}</button>
        <button :class="getRightButtonClass()">{{ getRightButtonLabel() }}</button>
        </div>
    </div>
    <div class="info column is-4 box">
      <h3 v-if="receivedData && receivedData.atisInfo"> {{ receivedData.atisInfo }} </h3>
    </div>
    <div class="optional column is-12">
      <div class="ws" v-if="receivedData && receivedData.atisWS">
        <p class= "first-p" v-if="receivedData && receivedData.atisWS">WS</p>
        <input type="text" v-if="receivedData && receivedData.atisWS" readonly class="input is-small custom-margin" :value="receivedData && receivedData.atisWS"/>
      </div>
      <div class="rcr" v-if="receivedData && receivedData.rcrContent">
        <p class= "first-p" v-if="receivedData && receivedData.rcrContent">RCR</p>
        <textarea v-if="receivedData && receivedData.rcrContent" readonly class="textarea custom-rcr is-small custom-margin" rows="2" :value="receivedData.rcrContent"></textarea>
      </div>
      <div class="wind">
        <p class= "first-p" v-if="receivedData && receivedData.windInfo">WIND</p>
        <input type="text" :value="receivedData && receivedData.windInfo" readonly class="input is-small custom-margin" />
      </div>     
      <div class="visibility">
        <p class= "first-p" v-if="receivedData && receivedData.visibility">VIS</p>
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.visibility" readonly class="input is-small custom-margin" />  
        <p v-if="receivedData && receivedData.prevailWx">Prevail. Wx</p> 
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.prevailWx" readonly class="input is-small custom-margin" />
      </div>
      <div class="rvr" v-if="receivedData && receivedData.rvr && receivedData.rvr !== 'N/A'">
        <p class= "first-p" v-if="receivedData && receivedData.rvr && receivedData.rvr !== 'N/A'">RVR</p>
        <input type="text" v-if="receivedData && receivedData.rvr && receivedData.rvr !== 'N/A'" readonly class="input is-small custom-margin" :value="receivedData && receivedData.rvr"/> 
      </div>
      <div class="wx">
        <p class= "first-p" v-if="receivedData && receivedData.weather && receivedData.weather !== 'N/A'">WX</p>
        <input type="text" :style="{ width: '10ch' }" v-if="receivedData && receivedData.weather && receivedData.weather !== 'N/A'" readonly class="input is-small custom-margin" :value="receivedData && receivedData.weather"/> 
        <p class= "first-p" v-if="receivedData && receivedData.clouds">CLD</p>
        <input type="text" :value="receivedData && receivedData.clouds" readonly class="input is-small custom-margin" />                                                                              
      </div>
      <div class="temp">
        <p class= "first-p" v-if="receivedData && receivedData.temperature">TEMP</p>
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.temperature" readonly class="input is-small custom-margin" />
        <p v-if="receivedData && receivedData.dewPoint">DP</p>
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.dewPoint" readonly class="input is-small custom-margin" />
      </div>       
    </div>
    <div class="qnh tile is-6 box">
      <h3 v-if="receivedData && receivedData.qnh"> {{ receivedData.qnh }} </h3>
    </div>
    <div class="space"></div>
    <div class="mmHg tile is-6 box">
      <h3 v-if="receivedData && receivedData.mmHg"> {{ receivedData.mmHg }} </h3>
    </div>
    <div class="remark column is-12">
      <p v-if="receivedData && receivedData.rmk">Remark</p>
      <textarea v-if="receivedData && receivedData.rmk" class="textarea is-small" rows="2" :value="receivedData.rmk" ></textarea>
    </div>
  </div>
</template>
  
  <script>

import io from 'socket.io-client';        

const socket = io('http://192.168.1.100:3000');

  export default {
    data() {
      return {
        //receivedData: null,
        receivedData:{ atisRWY: '21'},
      };
    },
    mounted() {
      socket.on('updateData', (data) => {
        this.receivedData = data;
        console.log(this.receivedData);
      });
    },
    beforeUnmount() {
      socket.off('updateData');
    },
    
    computed: {
    firstHalfOfRcr() {
      if (!this.receivedData.rcrContent) return '';
      const halfIndex = Math.ceil(this.receivedData.rcrContent.length / 2);
      console.log(this.receivedData.rcrContent.substring(0, halfIndex));
      return this.receivedData.rcrContent.substring(0, halfIndex);
    },
    secondHalfOfRcr() {
      if (!this.receivedData.rcrContent) return '';
      const halfIndex = Math.ceil(this.receivedData.rcrContent.length / 2);
      console.log(this.receivedData.rcrContent.substring(halfIndex));
      return this.receivedData.rcrContent.substring(halfIndex);
    },
  },

    methods: {
   getLeftButtonClass() {
       if (this.receivedData && this.receivedData.atisRWY === '21' || this.receivedData && this.receivedData.atisRWY === '21R') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '21L' || this.receivedData && this.receivedData.atisRWY === '03R') return 'button is-danger is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '03' || this.receivedData && this.receivedData.atisRWY === '03L') return 'button is-success is-small custom-margin';
       return 'button is-small custom-margin';
   },
   getRightButtonClass() {
       if (this.receivedData && this.receivedData.atisRWY === '21' || this.receivedData && this.receivedData.atisRWY === '21L') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '21R' || this.receivedData && this.receivedData.atisRWY === '03L') return 'button is-danger is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '03' || this.receivedData && this.receivedData.atisRWY === '03R') return 'button is-success is-small custom-margin';
       return 'button is-small custom-margin';
   },
   getLeftButtonLabel() {
       return this.receivedData && this.receivedData.atisRWY.startsWith('21') ? '21R' : '03L';
   },
   getRightButtonLabel() {
       return this.receivedData && this.receivedData.atisRWY.startsWith('21') ? '21L' : '03R';
   }

 }
  };
  </script>
  
  <style >
  .mandatory{
    padding-bottom: 0 !important;
    padding-left: 0 !important;
    padding-top: 0 !important;
  }
  .info{
    font-size: 600%;
    font-weight: bold;
    padding-bottom: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    margin-bottom: 0 !important;
    border: solid 1px black;
  }
  .qnh , .mmHg{
    font-size: 500%;
    font-weight: bold;
    margin-bottom: 0 !important;
    border: solid 1px black;
  }
  h3, .tag{
    font-weight: bold !important;
  }
  .time{
    display: flex;
    padding-bottom: 5px;
  }
  .tag{
    margin-bottom: 5px;
  }
  .first-p{
    width: 5ch;
    
  }
  
  .RWY{
    display: flex;
    
  }
  .custom-margin {
    margin-right: 5px;
    margin-left: 5px;
}
  .apch{
    display: flex;
    padding-bottom: 5px;
  }
  .optional{
    text-align: left;
    padding-top: 0 !important;
    padding-left: 0 !important;
    margin-top: 5px;
  }
  .ws{
    display: flex;
    padding-bottom: 5px;
  }
  .rcr{
    display: flex;
    padding-bottom: 5px;
  }
  .custom-rcr{
    min-width: 0 !important;
  }
  .wx{
    display: flex;
    padding-bottom: 5px;
  }
  .space{
    padding-left: 5px;
    padding-right: 5px;
  }
  .wind{
    display: flex;
    padding-bottom: 5px;
  }
  .visibility{
    display: flex;
    padding-bottom: 5px;
  }
  .rvr{
    display: flex;
    padding-bottom: 5px;
  }
  .temp{
    display: flex;
    padding-bottom: 5px;
  }
  .remark{
    text-align: left;
  }
  html,body,header,footer{
  background-color: lightskyblue !important;
  }
  </style>