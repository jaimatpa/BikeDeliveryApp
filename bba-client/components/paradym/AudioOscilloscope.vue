<!--
  The AudioStreamVisualizer component takes a stream and displays a wave

  Example:
    <AudioRecorder />
-->

<template>
  <canvas
    ref="canvas"
    class="oscilloscope"
    :style="{
      'max-width': width ? width + 'px' : 'unset',
      'max-height': height ? height + 'px' : 'unset',
      'min-height': height ? height + 'px' : 'unset',
    }"
  />
</template>

<script>
export default {
  name: "AudioOscilloscope",
  props: {
    stream: undefined,
    width: [Number, String],
    height: [Number, String],
  },
  mounted() {
    this.canvasCtx = this.$refs.canvas.getContext("2d");
    this.audioCtx = new AudioContext();
    this.visualize(this.stream);
  },
  data() {
    return {
      on: false,
      audioCtx: null,
      canvasCtx: null,
      dataArray: null,
    };
  },
  watch: {
    stream(newVal) {
      this.visualize(newVal);
    },
  },
  methods: {
    visualize(stream) {
      if (stream && stream instanceof MediaStream) {
        const source = this.audioCtx.createMediaStreamSource(stream);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        source.connect(this.analyser);
        this.on = true;
        this.draw();
      }
    },
    draw() {
      if (this.on) requestAnimationFrame(this.draw); // call this function before the next repaint

      if (this.$refs.canvas) {
        const WIDTH = this.$refs.canvas.width;
        const HEIGHT = this.$refs.canvas.height;
        this.analyser.getByteTimeDomainData(this.dataArray);

        //this.canvasCtx.fillStyle = 'rgb(255, 255, 255)'
        this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = "rgb(0, 200, 0)";

        this.canvasCtx.beginPath();

        let sliceWidth = (WIDTH * 1.0) / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
          let v = this.dataArray[i] / 128.0;
          let y = (v * HEIGHT) / 2;
          if (i === 0) this.canvasCtx.moveTo(x, y);
          else this.canvasCtx.lineTo(x, y);
          x += sliceWidth;
        }

        this.canvasCtx.lineTo(
          this.$refs.canvas.width,
          this.$refs.canvas.height / 2
        );
        this.canvasCtx.stroke();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.oscilloscope {
  width: 100%;
  height: 100%;
  display: block;
  margin: 0 auto;
  border-radius: 8px;
}
</style>
