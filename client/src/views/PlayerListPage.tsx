import { useQuery } from "@tanstack/react-query";
import LarpAPI from "../util/api";
import { useState } from "react";
import { Pagination, Skeleton, Stack, Typography } from "@mui/material";
import { TextLink } from "../components/ui/TextLink";
import { useUser } from "../hooks/useUser";
import { Navigate } from "react-router-dom";

export default function PlayerListPage() {
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const { data } = useQuery({
    queryKey: ["users", "listing", { page }],
    queryFn: () => LarpAPI.getListedUsers(page),
    enabled: !!user.username,
  });

  if (!user.username) {
    return <Navigate to="/auth/login" />;
  }

  const showPagination = data?.pages && data.pages > 1;
  const pagination = showPagination && (
    <Pagination
      sx={{ my: 2 }}
      count={data.pages}
      page={page + 1}
      onChange={(_event, page) => setPage(page - 1)}
    />
  );

  return (
    <>
      <Typography variant="h1">Players</Typography>

      <Typography variant="body2" mb={2}>
        <TextLink to="/my-larps">Edit your settings here</TextLink>
      </Typography>

      {pagination}

      <Stack component="ul" ml={2}>
        {data?.users.map((user) => (
          <li key={user.id}>
            <TextLink to={`/players/${user.username}/larps`}>
              {user.username}
            </TextLink>
          </li>
        ))}
        {!data && (
          <>
            <li>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={200} />
            </li>
          </>
        )}
      </Stack>

      {pagination}
    </>
  );
}
