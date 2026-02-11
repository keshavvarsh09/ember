/* ============================================================
   GARF WebRTC Manager
   Pure WebRTC logic — no React, no Supabase
   ============================================================ */

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
];

let peerConnection = null;
let localStream = null;
let remoteStream = null;

/** Create a new peer connection */
export function createPeer(onIceCandidate, onTrack, onConnectionStateChange) {
    closePeer();

    peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    remoteStream = new MediaStream();

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            onIceCandidate(event.candidate.toJSON());
        }
    };

    peerConnection.ontrack = (event) => {
        event.streams[0]?.getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
        onTrack(remoteStream);
    };

    peerConnection.onconnectionstatechange = () => {
        onConnectionStateChange?.(peerConnection.connectionState);
    };

    return peerConnection;
}

/** Get local media stream */
export async function getLocalStream(type = 'voice') {
    try {
        const constraints = {
            audio: true,
            video: type === 'video' ? { facingMode: 'user', width: 640, height: 480 } : false,
        };

        localStream = await navigator.mediaDevices.getUserMedia(constraints);

        // Add tracks to peer connection
        if (peerConnection) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }

        return localStream;
    } catch (err) {
        console.error('GARF: Failed to get media:', err);
        throw err;
    }
}

/** Create an SDP offer */
export async function createOffer() {
    if (!peerConnection) throw new Error('No peer connection');
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
}

/** Handle incoming SDP offer, return answer */
export async function handleOffer(offer) {
    if (!peerConnection) throw new Error('No peer connection');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
}

/** Handle incoming SDP answer */
export async function handleAnswer(answer) {
    if (!peerConnection) throw new Error('No peer connection');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

/** Add ICE candidate from remote peer */
export async function addIceCandidate(candidate) {
    if (!peerConnection) return;
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
        console.error('GARF: Failed to add ICE candidate:', err);
    }
}

/** Toggle mute on local audio */
export function toggleMute() {
    if (!localStream) return false;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled; // true = muted
    }
    return false;
}

/** Toggle camera on/off */
export function toggleCamera() {
    if (!localStream) return false;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled; // true = camera off
    }
    return false;
}

/** Stop all local streams */
export function stopLocalStream() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
}

/** Close peer connection */
export function closePeer() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    stopLocalStream();
    remoteStream = null;
}

/** Get current streams */
export function getLocalStreamRef() { return localStream; }
export function getRemoteStreamRef() { return remoteStream; }
export function getPeer() { return peerConnection; }
