import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { RiMusic2Fill } from 'react-icons/ri';
import Layout from '@/app/Layout';
import TracksTable from '@/app/TracksTable';
import { Album } from '@/types/types';
import { getter } from '@/utils/getter';
import { isAuthenticated } from '@/utils/isAuthenticated';
import Image from 'next/image';

interface IProps {
  album: Album;
}

export default function SingleAlbum({ album }: IProps) {
  return (
    <Layout title={`Spotify - ${album?.name}`}>
      <div className="flex items-end gap-6">
        {album && (
          <>
            {album.images.length > 0 ? (
              <Image
                src={album.images[0].url}
                alt={album.name}
                className="h-52 w-52 object-contain"
              />
            ) : (
              <div className="h-40 w-full">
                <RiMusic2Fill className="h-full w-full bg-paper " />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <h5 className="text-xs font-bold uppercase">{album.album_type}</h5>
              <h2 className="text-5xl font-bold">{album.name}</h2>

              <div className="flex items-center gap-5 text-sm">
                <span className="font-bold">{album.artists[0].name}</span>
                <span>{album.release_date}</span>
                {album.tracks.items.length > 0 && (
                  <span className="text-gray">{album.tracks.total} songs</span>
                )}{' '}
              </div>
            </div>
          </>
        )}
      </div>

      <TracksTable tracks={album?.tracks.items} noAlbum />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!(await isAuthenticated(session))) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const albumId = ctx.params.albumId;
  const album = await getter(`https://api.spotify.com/v1/albums/${albumId}`, session);
  return { props: { album } };
};
