import "./CompanyFiles.scss";
import { GrDocumentZip } from "react-icons/gr";
import { FcDocument } from "react-icons/fc";
import { copyTextToClipboard } from "../../helpers/navigator";
import { bank } from "../../data/bank__info";
import { CopyIcon } from "@chakra-ui/icons";
const ict_docs = [
  {
    title: "ДТЕП",
    link: "https://ictwork.site/files/DTEP.zip",
    img: <GrDocumentZip />,
  },
  {
    title: "Логістик",
    link: "https://ictwork.site/files/LOGISTIC.zip",
    img: <GrDocumentZip />,
  },
  {
    title: "Фрахт",
    link: "https://ictwork.site/files/FRAKHT.zip",
    img: <GrDocumentZip />,
  },
];
const fop_docs = [
  {
    title: "Гладій Л.О.",
    link: "https://ictwork.site/files/GLADIY.zip",
    img: <GrDocumentZip />,
  },
  {
    title: "Рубель О.М.",
    link: "https://ictwork.site/files/RYBEL.zip",
    img: <GrDocumentZip />,
  },
  {
    title: "Сніжко Н.М.",
    link: "https://ictwork.site/files/SNIZHKO.zip",
    img: <GrDocumentZip />,
  },
  {
    title: "Соломенцева З.Ю.",
    link: "https://ictwork.site/files/SOLOMENCEVA.zip",
    img: <GrDocumentZip />,
  },
  {
    title: "Теклишин Г.І.",
    link: "https://ictwork.site/files/TEKLYSHYN.zip",
    img: <GrDocumentZip />,
  },
];
const doc__word = [
  {
    title: "Опитувальний лист",
    link: "https://ictwork.site/files/ICT_LIST.doc",
    img: <FcDocument />,
  },
  {
    title: "Заява про ... персональних даних",
    link: "https://ictwork.site/files/OPD_ZAY.doc",
    img: <FcDocument />,
  },
];
const CompanyFiles = () => {
  return (
    <div className="company__files container">
      <div className="ict__docs">
        <h3>Документи ICT</h3>
        <div className="docs__block">
          {ict_docs.map((item, idx) => {
            return (
              <a
                key={idx}
                className="document__link-container"
                href={item.link}
                download
              >
                <div className="document__info-container">
                  {item.img}

                  <span className="document__name">{item.title}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <div className="ict__docs">
        <h3>Документи ФОП</h3>
        <div className="docs__block">
          {fop_docs.map((item, idx) => {
            return (
              <a
                key={idx}
                className="document__link-container"
                href={item.link}
                download
              >
                <div className="document__info-container">
                  {item.img}

                  <span className="document__name">{item.title}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <div className="ict__docs">
        <h3>Документи для контраентів</h3>
        <div className="docs__block">
          {doc__word.map((item, idx) => {
            return (
              <a
                key={idx}
                className="document__link-container"
                href={item.link}
                download
              >
                <div className="document__info-container">
                  {item.img}

                  <span className="document__name">{item.title}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <div className="ict__bank">
        {bank.map((item, idx) => {
          return (
            <div
              key={idx}
              onClick={() =>
                copyTextToClipboard(item.title + `\n\n${item.text}`)
              }
              className="bank__info"
            >
              <CopyIcon/>
              <p style={{ fontSize: "20px" }}>{item.title}</p>
              <p>{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyFiles;
