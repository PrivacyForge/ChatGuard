<script lang="ts">
  import type ChatGuard from "src/class";

  export let app: ChatGuard;
  const state = app.state;
  let isShow = false;
  let timeout: any = null;
  $: $state.loading ? handleOn() : handleDelayOff();

  const handleOn = () => {
    clearTimeout(timeout);
    isShow = true;
  };
  const handleDelayOff = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      isShow = false;
    }, 2000);
  };
  const handleCancel = () => {
    app.state.update((prev) => ({ ...prev, loading: false }));
    isShow = false;
  };
</script>

<div class="loading" class:show={isShow}>
  <div class="wrapper">
    {#if !$state.loading && isShow}
      <svg
        class="success-icon"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="122.881px"
        height="122.88px"
        viewBox="0 0 122.881 122.88"
        enable-background="new 0 0 122.881 122.88"
        xml:space="preserve"
        ><g
          ><path
            fill="#fff"
            d="M61.44,0c16.966,0,32.326,6.877,43.445,17.995s17.996,26.479,17.996,43.444c0,16.967-6.877,32.327-17.996,43.445 S78.406,122.88,61.44,122.88c-16.966,0-32.326-6.877-43.444-17.995S0,78.406,0,61.439c0-16.965,6.877-32.326,17.996-43.444 S44.474,0,61.44,0L61.44,0z M34.556,67.179c-1.313-1.188-1.415-3.216-0.226-4.529c1.188-1.313,3.216-1.415,4.529-0.227L52.3,74.611 l31.543-33.036c1.223-1.286,3.258-1.336,4.543-0.114c1.285,1.223,1.336,3.257,0.113,4.542L54.793,81.305l-0.004-0.004 c-1.195,1.257-3.182,1.338-4.475,0.168L34.556,67.179L34.556,67.179z M100.33,22.55C90.377,12.598,76.627,6.441,61.44,6.441 c-15.188,0-28.938,6.156-38.89,16.108c-9.953,9.953-16.108,23.702-16.108,38.89c0,15.188,6.156,28.938,16.108,38.891 c9.952,9.952,23.702,16.108,38.89,16.108c15.187,0,28.937-6.156,38.89-16.108c9.953-9.953,16.107-23.702,16.107-38.891 C116.438,46.252,110.283,32.502,100.33,22.55L100.33,22.55z" /></g
        ></svg>
      <h4>Handshake Accepted</h4>
    {:else}
      <svg
        class="icon"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="margin: auto; background: none; display: block; shape-rendering: auto;"
        width="200px"
        height="200px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid">
        <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#ffffff" stroke="none">
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 51;360 50 51"></animateTransform>
        </path>
      </svg>
      <h4>Waiting for Handshake</h4>
      <button on:click={handleCancel} class="button">Cancel Waiting</button>
    {/if}
  </div>
</div>

<style lang="scss">
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    transform: scale(1);
    background-color: rgba(0, 0, 0, 0.63);
    color: #fff;
    width: 100%;
    height: 100vh;
    z-index: 99999999999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
    transition: all 250ms ease;
    &.show {
      opacity: 1;
      pointer-events: all;
      visibility: visible;
      .wrapper {
        transform: scale(1) !important;
      }
    }
    .wrapper {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      transform: scale(0);
      transition: all 250ms ease;
      p {
        margin: 0;
      }
      .button {
        padding: 0.8rem 2rem;
        border-radius: 50rem;
        border: none;
        background-color: #0f7dff;
        color: #fff;
        cursor: pointer;
      }

      .success-icon {
        width: 8rem;
        height: 8rem;
      }
      .icon {
        width: 8rem;
        height: 8rem;
      }
    }
  }
</style>
