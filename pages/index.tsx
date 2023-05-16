// index_oldに SSRを追加して 読み込みなどを早くしてみる
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css"

// getServerSidePropsから渡される propsの型
type Props = {
    initialImageUrl: string;
};


const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    // useStateを使って状態を定義する
    // imageUrl: 画像のURLが代入される変数 初期値.空文字列
    // loading: APIを呼び出し中かを管理する変数 初期値.true
    const [imageUrl, setImageUrl] = useState(initialImageUrl);  //初期値を渡す
    const [loading, setLoading] = useState(false); // 初期状態は falseにしておく

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
        <div className={styles.page}>
            <button
                onClick={handleClick}
                style={{
                    backgroundColor: "#319795",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    padding: "4px 8px",
                }}
            >きょうのにゃんこ</button>
            <div>{loading || <img src={imageUrl} className={styles.img} />}</div>
        </div>
    );
};
// default exportされてた関数をページコンポーネントとして認識
export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();

    // IndexPageが引数として受け取るpropを戻り値に含める
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

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

