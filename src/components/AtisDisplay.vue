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
      <div class="ws hide-on-short-windows" v-if="receivedData && receivedData.atisWS">
        <p class= "first-p" v-if="receivedData && receivedData.atisWS">WS</p>
        <input type="text" v-if="receivedData && receivedData.atisWS" readonly class="input is-warning is-small custom-margin" :value="receivedData && receivedData.atisWS"/>
      </div>
      <div class="rcr hide-on-short-windows" v-if="receivedData && receivedData.rcrContent">
        <p class= "first-p" v-if="receivedData && receivedData.rcrContent">RCR</p>
        <textarea v-if="receivedData && receivedData.rcrContent" readonly class="textarea  is-warning custom-rcr is-small custom-margin" rows="2" :value="formattedRcrContent"></textarea>
      </div>
      <div class="wind hide-on-short-windows">
        <p class= "first-p" v-if="receivedData && receivedData.windInfo">WIND</p>
        <input type="text" :value="receivedData && receivedData.windInfo" readonly class="input is-small custom-margin" />
      </div>     
      <div class="visibility">
        <p class= "first-p" v-if="receivedData && receivedData.visibility">VIS</p>
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.visibility" readonly class="input is-small custom-margin" />  
        <p class="hide-on-tall-windows">Prevail. Wx</p> 
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.prevailWx" readonly class="input is-small custom-margin hide-on-tall-windows" />
      </div>
      <div class="rvr hide-on-short-windows" v-if="receivedData && receivedData.rvr && receivedData.rvr !== 'N/A'">
        <p class= "first-p" v-if="receivedData && receivedData.rvr && receivedData.rvr !== 'N/A'">RVR</p>
        <input type="text" v-if="receivedData && receivedData.rvr && receivedData.rvr !== 'N/A'" readonly class="input is-small custom-margin" :value="receivedData && receivedData.rvr"/> 
      </div>
      <div class="wx hide-on-short-windows">
        <p class="first-p">WX</p>
        <input type="text" readonly class="input is-small custom-margin" :value="formattedWeather"/> 
        <p class= "first-p" v-if="receivedData && receivedData.clouds">CLD</p>
        <input type="text" :value="receivedData && receivedData.clouds" readonly class="input is-small custom-margin" />                                                                              
      </div>
      <div class="temp hide-on-short-windows">
        <p class= "first-p" v-if="receivedData && receivedData.temperature">T/DP</p>
        <input type="text" :style="{ width: '15ch' }" :value="formattedTemp" readonly class="input is-small custom-margin" />
        <p>Prevail. Wx</p>
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
    <div class="supplementary column is-12 hide-on-short-windows">
      <p v-if="receivedData && receivedData.sup">Supplementary Information</p>
      <textarea v-if="receivedData && receivedData.sup" class="textarea is-small" rows="2" :value="receivedData.sup" ></textarea>
    </div>
    <div class="remark column is-12 ">
      <p v-if="receivedData && receivedData.rmk">Remark</p>
      <textarea v-if="receivedData && receivedData.rmk" class="textarea is-small" rows="2" :value="receivedData.rmk" ></textarea>
    </div>
  </div>
</template>
  
  <script>

import io from 'socket.io-client';        
//desktop as server
//const socket = io('http://192.168.1.100:3000');

//laptop as server
const socket = io('http://192.168.1.63:3000');

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
      formattedRcrContent() {
      if (!this.receivedData.rcrContent) return '';

      // Split the content into lines
      const lines = this.receivedData.rcrContent.split('\r\n');
      
      // Process each line to extract and format the desired parts
      const formattedLines = lines.map((line) => {
        // Extract the time, runway, and condition parts using a regular expression
        const match = line.match(/(\d{4})(\d{2})(\d{2}) (\w+) (.+?) (.+?) (.+?) (.+?)\r?$/);
      if (match) {
        // Ensure the time is four digits, pad with '0' if necessary
        let [, , hour, minute, runway, firstCondition] = match;
        hour = hour.padStart(2, '0'); // Pad hours to ensure two digits
        minute = minute.padStart(2, '0'); // Pad minutes to ensure two digits

        return `${hour}${minute}z ${runway} ${firstCondition}`;
      }
        return ''; // Return an empty string if the line does not match the pattern
      });

      // Join the formatted lines with a new line character
      return formattedLines.filter(line => line).join('\n'); // Filter out any empty strings and join the rest with new lines
    },

      formattedTemp(){
        const temp = this.receivedData.temperature ? `T${this.receivedData.temperature.replace('C', '')}` : '';
        const dewPoint = this.receivedData.dewPoint ? `DP${this.receivedData.dewPoint.replace('C', '')}` : '';
        return `${temp} ${dewPoint}`.trim();
    },
    formattedWeather() {
    return this.receivedData.weather === 'N/A' ? '' : this.receivedData.weather;
  }

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
    padding-top: 0 !important;
    padding-bottom: 0 !important;
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
    text-align: center;
    
    min-width: 5ch !important;
    width: 5ch !important;
    
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
  .input.is-warning, textarea.is-warning{
    background-color:lightgoldenrodyellow;
    
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
  .supplementary{
    text-align: left;
  }
  @media screen and (max-height: 450px) {
  .hide-on-short-windows {
    display: none !important;
    }
  }
  @media screen and (min-height: 451px) {
  .hide-on-tall-windows {
    display: none !important;
    }
  }

  html,body,header,footer{
  background-color: lightskyblue !important;
  }
  </style>