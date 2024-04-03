<template>
  <div class="columns is-mobile is-multiline">
    <div class="mandatory column is-8">
      <h6 class="tag is-large is-light" :class="{'is-primary': isConnected, 'is-danger': !isConnected}" @click="toggleWindowSize">VTBD - DEP ATIS</h6>
        <div class="time">
          <p class= "first-p">TIME</p>
          <input type="text" :style="{ width: '7ch' }" :value="receivedData && receivedData.atisTime" readonly class="input is-small custom-margin" />
          <p>MET AT</p>
          <input type="text" :style="{ width: '7ch' }" :value="receivedData && receivedData.metReportTime" readonly class="input is-small custom-margin" />
        </div>
        <div class="apch" :style="{ visibility: 'hidden' }">
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
        <input type="text" 
        
        :style="receivedData.prevailWx === 'VMC' ? { 'width': '20ch' } : { 'width': '15ch' }" 
        :value="receivedData && receivedData.visibility" 
        readonly 
        class="input is-small custom-margin" />  
        <p class="hide-on-tall-windows">Prevail. Wx</p> 
        <input type="text"  
        :style="[receivedData.prevailWx === 'IMC' ? { 'color': 'crimson', 'width': '4ch' } : { 'width': '6ch' }]" 
        :value="receivedData && receivedData.prevailWx" readonly class="input is-small custom-margin hide-on-tall-windows" 
        :class="{ 'is-danger': receivedData.prevailWx === 'IMC' }"
        />
        <input type="text" 
        v-if="receivedData.prevailWx === 'IMC'"
        :style="[receivedData.prevailWx === 'IMC' ? { 'color': 'crimson', 'width': '6ch' } : { 'width': '6ch' }]"
        :value="receivedData && receivedData.prevailVis" 
        readonly 
        class="input is-small custom-margin hide-on-tall-windows"
        :class="{ 'is-danger': receivedData.prevailWx === 'IMC' }"
        />
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
        <input type="text" :style="{ width: '12ch' }" :value="formattedTemp" readonly class="input is-small custom-margin" />
        <p>Prevail. Wx</p>
        <input type="text" 
        :style="[receivedData.prevailWx === 'IMC' ? { 'color': 'crimson', 'width': '4ch' } : { 'width': '5ch' }]" 
        :value="receivedData && receivedData.prevailWx" readonly class="input is-small custom-margin" 
        :class="{ 'is-danger': receivedData.prevailWx === 'IMC' }"/>
        <input type="text" 
        v-if="receivedData.prevailWx === 'IMC'"
        :style="[receivedData.prevailWx === 'IMC' ? { 'color': 'crimson', 'width': '7ch' } : { 'width': '7ch' }]"
        :value="receivedData && receivedData.prevailVis" 
        readonly 
        class="input is-small custom-margin"
        :class="{ 'is-danger': receivedData.prevailWx === 'IMC' }"
        />
      </div>       
    </div>
    <div class="qnh tile is-6 box" :class="{ 'flash-orange': flashQNH}">
      <div v-if="flashQNH" class="old-value-box">{{ oldQNH }}</div>
      <h3 v-if="receivedData && receivedData.qnh"> {{ receivedData.qnh }} </h3>
    </div>
    <div class="space"></div>
    <div class="mmHg tile is-6 box" :class="{ 'flash-orange': flashmmHg}">
      <div v-if="flashmmHg" class="old-value-box">{{ oldmmHg }}</div>
      <h3 v-if="receivedData && receivedData.mmHg"> {{ receivedData.mmHg }} </h3>
    </div>
    <div class="supplementary column is-12 hide-on-short-windows">
      <p>Supplementary Information</p>
      <textarea class="textarea is-small" rows="2" :value="receivedData.sup" ></textarea>
    </div>
    <div class="remark column is-12 hide-on-short-windows">
      <p>Remark</p>
      <textarea  class="textarea is-small" rows="4" :value="receivedData.rmk" ></textarea>
    </div><div class="remark column is-12 hide-on-tall-windows">
      <p>Remark</p>
      <textarea  class="textarea is-small" rows="3" :value="receivedData.rmk" ></textarea>
    </div>
  </div>
</template>
  
<script>
import io from 'socket.io-client';        
//import { ref } from 'vue';
  export default {
    data() {
      //const ip = ref(window.electron.getServerIp());
      //ref serverIp = window.electron.getServerIp();
      return {
        //receivedData: null,
        oldQNH: null,
        oldmmHg: null,
        socket: null,
        receivedData:{ atisRWY: '21'}, 
        flashInfo: false,
        flashQNH: false,
        flashmmHg: false,
        isConnected: false,
        serverIp: window.electron.getServerIp(),
      };
    },

     mounted() {
    this.setupServerConnection();
    this.setupSocketListeners();

    // Listen for server IP updates
    window.electron.on('server-ip-updated', async () => {
    console.log('server-ip-updated event received');
    const serverIp = await window.electron.getServerIp();
    console.log('Received server IP:', serverIp);
    
    await this.setupServerConnection();
    });
    },
    beforeUnmount() {
    if (this.socket) {
      this.socket.off('updateData');
      this.socket.disconnect();
      }

    // Remove the event listener
    window.electron.removeAllListeners('server-ip-updated');
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

    serverIp(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.serverIp = newVal;
        //this.setupServerConnection();
      }
    },
    'receivedData.atisInfo'(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.flashInfo = true;
            setTimeout(() => { this.flashInfo = false; }, 10000);
        }
    },
    'receivedData.qnh'(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.oldQNH = oldVal;
            this.flashQNH = true;
            this.playQNHSound();
            setTimeout(() => { this.flashQNH = false; }, 10000);
        }
    },
    'receivedData.mmHg'(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.oldmmHg = oldVal;
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
      toggleWindowSize() {
    window.electron.toggleWindowSize();
  },

      async setupServerConnection() {
      try {
        if (this.socket) {
          this.socket.disconnect();
        }

         // Get the updated server IP
        this.serverIp = await window.electron.getServerIp();
        console.log('Attempting to connect to server IP:', this.serverIp);

        // Establish a new socket connection
        this.socket = io(`http://${this.serverIp}:1250`);
        this.setupSocketListeners();
      } catch (error) {
        console.error('Error setting up server connection:', error);
      }
    },
    setupSocketListeners() {
      if (this.socket) {
        this.socket.on('connect', () => {
          this.isConnected = true;
        });

        this.socket.on('disconnect', () => {
          this.isConnected = false;
        });

        this.socket.on('updateData', (data) => {
          this.receivedData = data;
          console.log(this.receivedData);
        });
      }
    },

   getLeftButtonClass() {
       if (this.receivedData && this.receivedData.atisRWY === '21' || this.receivedData && this.receivedData.atisRWY === '21L') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '21R' || this.receivedData && this.receivedData.atisRWY === '03R') return 'button is-danger is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '03' || this.receivedData && this.receivedData.atisRWY === '03L') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY ===  'CLSD') return 'button is-danger is-small custom-margin';
       return 'button is-small custom-margin';
   },
   getRightButtonClass() {
       if (this.receivedData && this.receivedData.atisRWY === '21' || this.receivedData && this.receivedData.atisRWY === '21R') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '21L' || this.receivedData && this.receivedData.atisRWY === '03L') return 'button is-danger is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY === '03' || this.receivedData && this.receivedData.atisRWY === '03R') return 'button is-success is-small custom-margin';
       if (this.receivedData && this.receivedData.atisRWY ===  'CLSD') return 'button is-danger is-small custom-margin';
       return 'button is-small custom-margin';
   },
   getLeftButtonLabel() {
       if (this.receivedData && this.receivedData.atisRWY === 'CLSD') 
        return '21L';
       else
        return this.receivedData && this.receivedData.atisRWY.startsWith('21') ? '21L' : '03L';
   },
   getRightButtonLabel() {
      if (this.receivedData && this.receivedData.atisRWY === 'CLSD') 
        return '21R';
      else
        return this.receivedData && this.receivedData.atisRWY.startsWith('21') ? '21R' : '03R';
   },

   hasAtisWS() {
    return this.receivedData && this.receivedData.atisWS && this.receivedData.atisWS !== 'N/A';
  },
   hasRcrContent() {
    return this.receivedData && this.receivedData.rcrContent && this.receivedData.rcrContent !== 'N/A';
  },
  async playQNHSound() {
    let audioSrc;
    if (process.env.NODE_ENV === 'development') {
        audioSrc = 'QNH.WAV'; // Development path
        this.playAudio(audioSrc);
    } else {
        // Use the exposed function from the preload script
        const audioData = await window.electron.loadAudio('QNH.WAV');
        if (audioData) {
            const audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });
            audioSrc = URL.createObjectURL(audioBlob);
            this.playAudio(audioSrc);
        }
    }
  },
  async playIMCSound() {
    let audioSrc;
    if (process.env.NODE_ENV === 'development') {
        audioSrc = 'IMC.wav'; // Development path
        this.playAudio(audioSrc);
    } else {
        // Use the exposed function from the preload script
        const audioData = await window.electron.loadAudio('IMC.wav');
        if (audioData) {
            const audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });
            audioSrc = URL.createObjectURL(audioBlob);
            this.playAudio(audioSrc);
        }
    }
  },
  async playVMCSound() {
    let audioSrc;
    if (process.env.NODE_ENV === 'development') {
        audioSrc = 'VMC.wav'; // Development path
        this.playAudio(audioSrc);
    } else {
        // Use the exposed function from the preload script
        const audioData = await window.electron.loadAudio('VMC.wav');
        if (audioData) {
            const audioBlob = new Blob([new Uint8Array(audioData)], { type: 'audio/wav' });
            audioSrc = URL.createObjectURL(audioBlob);
            this.playAudio(audioSrc);
        }
    }
  },
  playAudio(src) {
      const audio = new Audio(src);
      console.log('Playing audio:', src);
      audio.play().catch(e => console.error('Error playing sound:', e));
  },

 }
  };
  </script>
  
  <style >


  .old-value-box {
    position: absolute; /* Position it relative to the parent */
    font-size: 0.2em !important;
    top: 0;
    right: 0;
    background-color: #fff; /* You can change the background color */
    padding-left: 1em;
    padding-right: 1em;
    color: darkblue;
    z-index: 10; /* Ensure it's above other content */
}

  
  .mandatory{
    padding-bottom: 0 !important;
    padding-left: 0 !important;
    padding-top: 0 !important;
  }
  .info{
    line-height: 1 !important;
    font-size: 8.6em;
    font-weight: bold;
    padding-bottom: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    margin-bottom: 0 !important;
    border: solid 1px black;
  }
  .qnh , .mmHg{
    position: relative;
    font-size: 5em;
    font-weight: bold;
    margin-bottom: 0 !important;
    border: solid 1px black;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  h3, .tag{
    font-weight: bold !important;
    
  }
  p{
    font-weight: 800;
    font-size: medium;
  }

  .button{

    font-weight: bold;
    color: #2c3e50 !important;
    border: solid 1px #2c3e50 !important;
    line-height: 1.4 !important;
    height: auto !important;
    font-size: 1.1em !important;
    padding-top: 1px !important;
    padding-bottom: 1px !important;
  }

   input, textarea , select{
    font-weight: bold !important;
    padding-left: 0.2em !important;
    padding-right: 1px !important;
    padding-top: 1px !important;
    padding-bottom: 1px !important;
    font-size: 1.1em !important;
    line-height: 1.4 !important;
    height: auto !important;
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
    padding-bottom: 0 !important;
  }
  @media screen and (max-height: 470px) {
  .hide-on-short-windows {
    display: none !important;
    }
  }
  @media screen and (min-height: 471px) {
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
  background-color: lemonchiffon !important;
  }
  </style>