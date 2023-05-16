import { worker } from "cluster";
import { NextPage } from "next";
import { SubresourceIntegrityPlugin } from "next/dist/build/webpack/plugins/subresource-integrity-plugin";
import { useEffect, useState } from "react";

const IndexPage: NextPage = () => {
    // useStateを使って状態を定義する
    // imageUrl: 画像のURLが代入される変数 初期値.空文字列
    // loading: APIを呼び出し中かを管理する変数 初期値.true
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    // マウント(はじめて表示される)のとき 画像を読み込む宣言
    // useEffect(処理内容, どのタイミングで処理内容を実行するか)
    // []なのは、 コンポーネントがマウントされたときのみ実行されるの意味
    useEffect(() => {

        // 非同期関数であるfetchImageが 終わってから(情報をとってきてから) useStateの状態を更新する
        // useEffectには非同期関数を直接渡せないので 別で書く
        fetchImage().then((newImage) => {
            setImageUrl(newImage.url); // 画像URLの状態を更新する
            setLoading(false);  // ローディング状態を更新する
        });
    }, []);


    // ボタンをクリックしたときに画像を読み込む処理
    const handleClick = async () => {
        setLoading(true); // 読み込み中フラグを立てる。

        const newImage = await fetchImage();
        setImageUrl(newImage.url); //画像URLの状態を更新する
        setLoading(false); // 読み込み中フラグを下ろす
    };
    // ローディング中(loading=false)でなければ 画像を表示する
    // {}を使うJSXの構文は 式のみ しか記述できないため 文であるif文は記述できない。
    return (
        <div>
            <button onClick={handleClick}>ほかのにゃんこもみる</button>
            <div>{loading || <img src={imageUrl} />}</div>
        </div>
    );
};
// default exportされてた関数をページコンポーネントとして認識
export default IndexPage;

type Image = {
    url: string;
};

const fetchImage = async (): Promise<Image> => {
    // awaitを使うことで、 リソースが取得されて オブジェクトして返す処理を"待つ"ことができる。
    // fetch で HTTPリクエストを送り、リソースを取得する
    const res = await fetch("https://api.thecatapi.com/v1/images/search");

    // 返されたレスポンスオブジェクトからjsonとしてパース、jsonのオブジェクトとして取得
    const images = await res.json();

    console.log(images);
    return images[0];


};

