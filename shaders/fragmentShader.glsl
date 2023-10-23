#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform sampler2D uTexture;

void main( void ) {
    gl_FragColor = texture2D(uTexture, vTextureCoord);
}