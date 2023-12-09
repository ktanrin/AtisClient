<template>
  <div class="columns is-mobile is-multiline">
    <div class="mandatory column is-8">
      <h6 class="tag is-large is-light" :class="{'is-primary': isConnected, 'is-danger': !isConnected}">VTBD - ARR ATIS</h6>
        <div class="time">
          <p class= "first-p">TIME</p>
          <input type="text" :style="{ width: '8ch' }" :value="receivedData && receivedData.atisTime" readonly class="input is-small custom-margin" />
          <p>MET AT</p>
          <input type="text" :style="{ width: '8ch' }" :value="receivedData && receivedData.metReportTime" readonly class="input is-small custom-margin" />
        </div>
        <div class="apch">
        <p class= "first-p" v-show="receivedData && receivedData.appType && receivedData.appType.toLowerCase() !== 'n/a'">APCH</p>
        <input type="text" v-show="receivedData && receivedData.appType && receivedData.appType.toLowerCase() !== 'n/a'" :value="receivedData && receivedData.appType" readonly class="input is-small custom-margin" />
        </div>
        <div class="RWY">
        <p class= "first-p">RWY</p>
        <input type="text" :style="{ width: '7ch' }" :value="receivedData && receivedData.atisRWY" readonly class="input is-small custom-margin" />
        <button :class="getLeftButtonClass()">{{ getLeftButtonLabel() }}</button>
        <button :class="getRightButtonClass()">{{ getRightButtonLabel() }}</button>
        </div>
    </div>
    <div class="info column is-4 box" :class="{ 'flash-orange': flashInfo}">
      <h3 v-if="receivedData && receivedData.atisInfo"> {{ receivedData.atisInfo }} </h3>
    </div>
    <div class="optional column is-12">
      <div class="ws hide-on-short-windows">
        <p class= "first-p">WS</p>
        <input type="text" readonly class="input is-small custom-margin" :class="{'is-warning': hasAtisWS()}" :value="receivedData && receivedData.atisWS"/>
      </div>
      <div class="rcr hide-on-short-windows">
        <p class= "first-p">RCR</p>
        <textarea readonly class="textarea custom-rcr is-small custom-margin"  :class="{'is-warning': hasAtisWS()}" rows="2" :value="formattedRcrContent"></textarea>
      </div>
      <div class="wind hide-on-short-windows">
        <p class= "first-p">WIND</p>
        <input type="text" :value="receivedData && receivedData.windInfo" readonly class="input is-small custom-margin" />
      </div>     
      <div class="visibility">
        <p class= "first-p">VIS</p>
        <input type="text" :style="{width: '30ch'}" :value="receivedData && receivedData.visibility" readonly class="input is-small custom-margin" />  
        <p class="hide-on-tall-windows">Prevail. Wx</p> 
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.prevailWx" readonly class="input is-small custom-margin hide-on-tall-windows" />
        <p class= "first-p hide-on-short-windows">RVR</p>
        <input type="text" readonly class="input is-small custom-margin hide-on-short-windows" :value="formattedRVR"/> 
      </div>
      <div class="wx hide-on-short-windows">
        <p class="first-p">WX</p>
        <input type="text" readonly class="input is-small custom-margin" :value="formattedWeather"/>                                                                            
      </div>
      <div class="clouds hide-on-short-windows">
        <p class= "first-p">CLD</p>
        <input type="text" :value="receivedData && receivedData.clouds" readonly class="input is-small custom-margin" />   
      </div>
      <div class="temp hide-on-short-windows">
        <p class= "first-p">T/DP</p>
        <input type="text" :style="{ width: '15ch' }" :value="formattedTemp" readonly class="input is-small custom-margin" />
        <p>Prevail. Wx</p>
        <input type="text" :style="{ width: '10ch' }" :value="receivedData && receivedData.prevailWx" readonly class="input is-small custom-margin" />
      </div>       
    </div>
    <div class="qnh tile is-6 box" :class="{ 'flash-orange': flashQNH}">
      <h3 v-if="receivedData && receivedData.qnh"> {{ receivedData.qnh }} </h3>
    </div>
    <div class="space"></div>
    <div class="mmHg tile is-6 box" :class="{ 'flash-orange': flashmmHg}">
      <h3 v-if="receivedData && receivedData.mmHg"> {{ receivedData.mmHg }} </h3>
    </div>
    <div class="supplementary column is-12 hide-on-short-windows">
      <p>Supplementary Information</p>
      <textarea class="textarea is-small" rows="2" :value="receivedData.sup" ></textarea>
    </div>
    <div class="remark column is-12 ">
      <p>Remark</p>
      <textarea class="textarea is-small" rows="4" :value="receivedData.rmk" ></textarea>
    </div>
  </div>
</template>
  
  <script>

import io from 'socket.io-client';        
//desktop as server
const socket = io('http://localhost:3000');
//const socket = io(`http://${ip}:3000`);
//laptop as server
//const socket = io('http://192.168.1.151:3000');

  export default {
    data() {
      return {
        //receivedData: null,
        receivedData:{ atisRWY: '21'}, 
        flashInfo: false,
        flashQNH: false,
        flashmmHg: false,
        isConnected: false,
      };
    },
    mounted() {
      socket.on('connect', () => {
        this.isConnected = true;
      });

      socket.on('disconnect', () => {
        this.isConnected = false;
      });

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
    },

    formattedRVR(){
      return this.receivedData.rvr === 'N/A' ? '' : this.receivedData.rvr;
    }

    

  },
  watch: {
    'receivedData.atisInfo'(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.flashInfo = true;
            setTimeout(() => { this.flashInfo = false; }, 10000);
        }
    },
    'receivedData.qnh'(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.flashQNH = true;
            this.playQNHSound();
            setTimeout(() => { this.flashQNH = false; }, 10000);
        }
    },
    'receivedData.mmHg'(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.flashmmHg = true;
            setTimeout(() => { this.flashmmHg = false; }, 10000);
        }
    },
    'receivedData.prevailWx'(newVal) {
        if (newVal === 'IMC') {
            this.playIMCSound();
        }
        else if (newVal === 'VMC') {
            this.playVMCSound();
        }
    },

    // ... other watchers ...
  },
    methods: {
   getLeftButtonClass() {
       if (this.receivedData && this.receivedData.atisRWY === '21' || this.receivedData && this.receivedData.atisRWY === '21R') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '21L' || this.receivedData && this.receivedData.atisRWY === '03R') return 'button is-danger is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '03' || this.receivedData && this.receivedData.atisRWY === '03L') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY ===  'CLSD') return 'button is-danger is-small custom-margin';
       return 'button is-small custom-margin';
   },
   getRightButtonClass() {
       if (this.receivedData && this.receivedData.atisRWY === '21' || this.receivedData && this.receivedData.atisRWY === '21L') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '21R' || this.receivedData && this.receivedData.atisRWY === '03L') return 'button is-danger is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '03' || this.receivedData && this.receivedData.atisRWY === '03R') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY ===  'CLSD') return 'button is-danger is-small custom-margin';
       return 'button is-small custom-margin';
   },
   getLeftButtonLabel() {
       if (this.receivedData && this.receivedData.atisRWY === 'CLSD') 
        return '21R';
       else
        return this.receivedData && this.receivedData.atisRWY.startsWith('21') ? '21R' : '03L';
   },
   getRightButtonLabel() {
      if (this.receivedData && this.receivedData.atisRWY === 'CLSD') 
        return '21L';
      else
        return this.receivedData && this.receivedData.atisRWY.startsWith('21') ? '21L' : '03R';
   },

   hasAtisWS() {
    return this.receivedData && this.receivedData.atisWS && this.receivedData.atisWS !== 'N/A';
  },
   hasRcrContent() {
    return this.receivedData && this.receivedData.rcrContent && this.receivedData.rcrContent !== 'N/A';
  },
  playQNHSound() {
    const audio = new Audio('QNH.WAV');
    audio.play();
  },
  playIMCSound() {
    const audio = new Audio('IMC.wav');
    audio.play();
  },
  playVMCSound() {
    const audio = new Audio('VMC.wav');
    audio.play();
  },

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
  .clouds{
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

  @keyframes flash-orange {
    0%, 100% { background-color: white; }
    50% { background-color: orange; }
  }

  .flash-orange {
    animation: flash-orange 1s 20; /* Run for 1 second and repeat twice */
  }

  html,body,header,footer{
  background-color: lightskyblue !important;
  }
  </style>