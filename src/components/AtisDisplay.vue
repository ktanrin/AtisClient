<template>
  <div class="columns is-mobile is-multiline">
    <div class="mandatory column is-8">
      <h6 class="tag is-large is-light">VTBD - ARR ATIS</h6>
        <div class="time">
          <p v-if="receivedData && receivedData.atisTime">TIME</p>
          <input type="text" :style="{ width: '8ch' }" :value="receivedData && receivedData.atisTime" readonly class="input is-small custom-margin" />
          <p v-if="receivedData && receivedData.metReportTime">MET AT</p>
          <input type="text" :style="{ width: '8ch' }" :value="receivedData && receivedData.metReportTime" readonly class="input is-small custom-margin" />
        </div>
        <div class="apch">
        <p v-if="receivedData && receivedData.appType && receivedData.appType.toLowerCase() !== 'n/a'">APCH</p>
        <input type="text" :value="receivedData && receivedData.appType" readonly class="input is-small custom-margin" />
        </div>
        <div class="RWY">
        <p v-if="receivedData && receivedData.atisRWY">RWY</p>
        <input type="text" :style="{ width: '7ch' }" :value="receivedData && receivedData.atisRWY" readonly class="input is-small custom-margin" />
        <button :class="getLeftButtonClass()">{{ getLeftButtonLabel() }}</button>
        <button :class="getRightButtonClass()">{{ getRightButtonLabel() }}</button>
        </div>
    </div>
    <div class="info column is-4 box">
      <h3 v-if="receivedData && receivedData.atisInfo"> {{ receivedData.atisInfo }} </h3>
    </div>
    <div class="optional column is-12">
      <div class="visibility">
        <p v-if="receivedData && receivedData.visibility">VIS</p>
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.visibility" readonly class="input is-small custom-margin" />  
        <p v-if="receivedData && receivedData.prevailWx">Prevail. Wx</p> 
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.prevailWx" readonly class="input is-small custom-margin" />
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
  .time{
    display: flex;
    padding-bottom: 5px;
  }
  .tag{
    margin-bottom: 5px;
  }
  .time p, .apch p, .RWY p, .visibility p {
  }
  .RWY{
    display: flex;
    padding-bottom: 5px;
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
  }
  .space{
    padding-left: 5px;
    padding-right: 5px;
  }
  .visibility{
    display: flex;
  }
  .remark{
    text-align: left;
  }
  html,body,header,footer{
  background-color: lightskyblue !important;
  }
  </style>